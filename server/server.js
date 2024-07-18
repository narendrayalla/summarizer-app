// server/server.js

require("dotenv").config();
const OpenAI = require("openai");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Define a schema for summaries
const summarySchema = new mongoose.Schema({
	text: String,
	summarizedText: String,
});

// Define a model for the schema
const Summary = mongoose.model("Summary", summarySchema);

app.post("/api/summarize", async (req, res) => {
	const { text } = req.body;

	const openai = new OpenAI({
		apiKey: OPENAI_API_KEY,
	});

	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						`Summarize content you are provided with
						for a second-grade student.`,
				},
				{
					role: "user",
					content: text,
				},
			],
			temperature: 0.7,
			max_tokens: 64,
			top_p: 1,
		});

		const summarizedText = String(response.choices[0].message.content);

		// Save the summary to MongoDB
		const newSummary = new Summary({ text, summarizedText });
		await newSummary.save();

		res.json({ summary: summarizedText });
	} catch (error) {
		console.error("Error calling OpenAI API:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
