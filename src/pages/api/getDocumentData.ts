import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { text } = req.body;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a lawyer for someone who speaks english as a second language. The user will submit a legal document's text for review. Can you summarize the document's key points, highlight any sketchy areas, and give a score out of 100 on how reliable this document sounds? Please format the response as a JSON object with keys 'summaryPoints', 'sketchyClauses', and 'score'.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      });

      res.status(200).json(completion);
    } catch (error) {
      console.error("Error making OpenAI request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
