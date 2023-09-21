import { NextApiRequest, NextApiResponse } from 'next';
import { saveHunk } from '../../utils/db/relevance';

const hunkHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const hunkJson = req.body;
  console.info("[hunkHandler] Saving hunks...");
  const result: void | null = await saveHunk(hunkJson)
  .catch((error) => {
    console.error('[hunkHandler] Error publishing message:', error);
    return null;
  });
  if (result == null) {
    res.status(500)
      .json({ error: 'Failed to publish message. Data must be in the form of a Buffer.' });
    return;
  }
  res.status(200).send("Success");
}

export default hunkHandler;