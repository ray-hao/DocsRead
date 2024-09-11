import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { file } = req.body;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: file.name,
      Body: Buffer.from(file.data, "base64"),
      ContentType: file.type,
    };

    try {
      const data = await s3.upload(params).promise();
      res.status(200).json({ url: data.Location });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
