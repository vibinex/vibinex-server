import { NextApiRequest, NextApiResponse } from 'next';
import { saveHunk } from '../../utils/db/relevance';

const hunkHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const hunkJson = req.body;
  console.info("Saving hunks...");
  try {
    await saveHunk(hunkJson);
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).json({ error: 'Failed to publish message. Data must be in the form of a Buffer.' });
  }
  res.status(200).send("Success");
}

export default hunkHandler;