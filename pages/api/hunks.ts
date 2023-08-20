import { NextApiRequest, NextApiResponse } from 'next';
import { saveHunk } from '../../utils/db/relevance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const hunkjson = req.body;
  console.log("Publishing message: ", hunkjson);
  try {
    saveHunk(hunkjson);
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).json({ error: '<failure>Failed to publish message. Data must be in the form of a Buffer.</failure>' });
  }
  res.status(200).send("Success");
}