const express = require("express");
const app = express();
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "strawberry", "pineapple"] });
});

app.post("/api/test-anthropic", async (req, res) => {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content:
            "Hi Claude! Please respond with: 'Connection test successful!'",
        },
      ],
    });

    res.json({
      success: true,
      message: message.content[0].text,
    });
  } catch (error) {
    console.error("Anthropic API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to connect to Anthropic API",
    });
  }
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
