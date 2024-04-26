import { NextApiRequest, NextApiResponse } from 'next';
import { saveHunk, saveNewAuthorAliasesFromHunkData } from '../../utils/db/relevance';

interface BlameItem {
	author: string,
	timestamp?: string,
	line_start: string,
	line_end: string,
	filepath: string,
	commit?: string,
	filepath_raw?: string,
}

export interface DPUHunkInfo {
	repo_provider: string,
	repo_owner: string,
	repo_name: string,
	prhunkvec: {
		pr_number: string,
		author: string,
		blamevec: BlameItem[]
	}[],
	db_key: string,
}

const hunkHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const hunkJson = req.body;
	console.info("[hunkHandler] Saving hunks...");
	let hunkInfo: DPUHunkInfo;
	try {
		hunkInfo = JSON.parse(hunkJson);
	}
	catch (error) {
		console.error('[hunkHandler] Error parsing hunk json:', error);
		res.status(400).json({ error: 'Invalid hunk json' });
		return;
	}
	const result: void | null = await saveHunk(hunkInfo)
		.catch((error) => {
			console.error('[hunkHandler] Error saving hunk:', error);
			return null;
		});
	if (result == null) {
		res.status(500).json({ error: 'Failed to save hunk to db' });
		return;
	}
	res.status(200).send("Success");

	// extract authors from hunkmap and save in aliases table and repos table
	saveNewAuthorAliasesFromHunkData(hunkInfo).catch((error) => {
		console.error('[hunkHandler] Error saving new author aliases from hunk data:', error);
	});
}

export default hunkHandler;