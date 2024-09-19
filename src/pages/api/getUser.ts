import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Auth0 ID is required" });
    }

    const params = {
      TableName: "User",
      Key: {
        UserId: userId,
      },
    };

    try {
      const data = await dynamoDb.get(params).promise();
      if (data.Item) {
        res.status(200).json(data.Item);
      } else {
        res.status(200).json(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      res.status(500).json({ error: "Could not check user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
