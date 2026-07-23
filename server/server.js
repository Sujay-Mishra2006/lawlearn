import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `
You are LexAI, an Indian legal assistant.

Rules:
- Explain Indian laws in simple English.
- Mention that you are not a lawyer.
- Never invent laws.
- If unsure, say so.
- Keep answers concise and practical.

Question:
${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    res.json({
      answer: response.text,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      answer: "Sorry, the AI service is currently unavailable.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});