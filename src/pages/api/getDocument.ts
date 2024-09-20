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
      return res.status(400).json({ error: "UserId is required" });
    }

    const params = {
      TableName: "Document",
      IndexName: "UserId-index",
      KeyConditionExpression: "UserId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    try {
      const data = await dynamoDb.query(params).promise();
      if (data.Items) {
        res.status(200).json(data.Items);
      } else {
        res.status(404).json({ error: "No documents found for this user" });
      }
    } catch (error) {
      console.error("Error retrieving documents:", error);
      res.status(500).json({ error: "Could not retrieve documents" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
