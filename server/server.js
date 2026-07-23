import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(serverDir, ".env");

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match || match[1].startsWith("#")) continue;

    const [, key, rawValue = ""] = match;
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const app = express();
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON request body.",
      answer: "LexAI received an invalid request. Please try again.",
    });
  }

  next(err);
});

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

function legalAnswerPrompt(question, context = "") {
  return `
You are LexAI, an Indian legal assistant.

Rules:
- Explain Indian laws in simple English.
- Mention that you are not a lawyer.
- Never invent laws.
- If unsure, say so.
- Keep answers concise and practical.

${context ? `Context:\n${context}\n` : ""}
Question:
${question}
`;
}

function hotTopicsPrompt() {
  return `
You are LexAI, an Indian legal research assistant.

Return only valid JSON, with no markdown fences or explanation.
Create 6 current Indian legal hot topics as an array of objects.
Each object must have: id, title, category, urgency, time.
category must be one of: criminal, civil, constitutional, corporate, family, property, cyber, labour.
urgency must be one of: high, medium, low.
time should be a short relative label such as "2 hrs ago".
`;
}

function cleanJsonText(text) {
  return text.replace(/```json|```/g, "").trim();
}

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    model: MODEL,
    aiConfigured: Boolean(ai),
  });
});

app.post("/ask", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server.",
        answer: "LexAI is not configured yet. Add GEMINI_API_KEY to the backend environment and restart the server.",
      });
    }

    const { question, context = "", mode } = req.body || {};

    if (mode === "hotTopics") {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: hotTopicsPrompt(),
      });
      const text = cleanJsonText(response.text || "");
      const topics = JSON.parse(text);

      return res.json({
        topics,
      });
    }

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Question is required.",
        answer: "Please enter a legal question before asking LexAI.",
      });
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: legalAnswerPrompt(question, context),
    });

    const answer = (response.text || "").trim();

    if (!answer) {
      throw new Error("Gemini returned an empty response.");
    }

    res.json({
      answer,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message || "AI service failed.",
      answer: "Sorry, the AI service is currently unavailable.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
