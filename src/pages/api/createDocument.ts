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
    const {
      databaseFileName,
      uploadedFileUrl,
      bboxInformation,
      documentInformation,
      userId,
    } = req.body;

    if (
      !databaseFileName ||
      !uploadedFileUrl ||
      !bboxInformation ||
      !documentInformation ||
      !userId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const params = {
      TableName: "Document",
      Item: {
        DocumentId: databaseFileName,
        DocumentFileUrl: uploadedFileUrl,
        DocumentbboxInformation: bboxInformation,
        DocumentInformation: documentInformation,
        UserId: userId,
      },
    };

    try {
      await dynamoDb.put(params).promise();
      res.status(201).json({ message: "Document added successfully" });
    } catch (error) {
      console.error("Error adding document:", error);
      res.status(500).json({ error: "Could not add document" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
