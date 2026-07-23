import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  // Temporary response
  res.json({
    answer:
      "Backend received your question:\n\n" +
      question +
      "\n\nCongratulations! Your website is now communicating with a backend."
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on 5000");
});