import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { textArray } = req.body;

    try {
      const results = await Promise.all(
        textArray.map(async (text: string) => {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a lawyer for someone who speaks english as a second language. The input is a section of a legal document. The 'summary' property is a 1-3 sentence summary in grade 3 terms, and the 'color' property should be green, yellow, or red indicating if the section is safe or potentially sketchy, or definitely sketchy.",
              },
              {
                role: "user",
                content: text,
              },
            ],
          });
          return completion.choices[0].message;
        })
      );
      const cleanedResults = results
        .map((result) => {
          try {
            return JSON.parse(result.content);
          } catch (e) {
            console.error("Error parsing JSON:", e);
            return { summary: "an error occured", color: "gray" };
          }
        })
        .filter((result) => result !== null);
      res.status(200).json(cleanedResults);
    } catch (error) {
      console.error("Error making OpenAI request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
