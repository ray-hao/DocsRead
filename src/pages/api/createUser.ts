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
  if (req.method === "POST") {
    const { email, UserId } = req.body;

    if (!email || !UserId) {
      return res.status(400).json({ error: "Email and Auth0 ID are required" });
    }

    const params = {
      TableName: "User",
      Item: {
        email,
        UserId,
      },
    };

    try {
      await dynamoDb.put(params).promise();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Could not create user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
