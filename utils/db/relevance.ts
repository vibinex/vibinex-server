import conn from '.';
import { getUserByAlias } from './users';
import { v4 as uuidv4 } from 'uuid';
import { convert } from './converter';
import type { DPUHunkInfo } from '../../pages/api/hunks';

export interface HunkInfo {
	author: string,
	timestamp?: string,
	line_start: number,
	line_end: number,
	filepath: string,
}

export interface DbHunks {
	repo_provider: string,
	repo_owner: string,
	repo_name: string,
	pr_number: string,
	author: string,
	hunks: {
		blamevec: HunkInfo[]
	}
}

export const saveHunk = async (hunkInfo: DPUHunkInfo) => {
	console.info(`[saveHunk] Saving hunk for ${hunkInfo.repo_provider}/${hunkInfo.repo_owner}/${hunkInfo.repo_name}`);
	for (const prHunk of hunkInfo.prhunkvec) {
		const hunk_val = JSON.stringify({ "blamevec": prHunk.blamevec });
		const hunk_query = `
	  INSERT INTO hunks (repo_provider, repo_owner, 
		repo_name, review_id, author, hunks
		) VALUES ('${hunkInfo.repo_provider}',
			'${hunkInfo.repo_owner}', 
			'${hunkInfo.repo_name}',
			'${prHunk.pr_number}',
			'${prHunk.author}',
			'${hunk_val}')
		ON CONFLICT (repo_provider, repo_owner, repo_name, review_id) DO UPDATE SET 
		hunks = EXCLUDED.hunks
	`;
		await conn.query(hunk_query).catch(err => {
			console.error(`[saveHunk] Failed to insert hunks in the db`, { pg_query: hunk_query }, err);
		});
	}
}

export const saveNewAuthorAliasesFromHunkData = async (hunkInfo: DPUHunkInfo) => {
	console.debug(`[saveNewAuthorAliases] Saving new author aliases for ${hunkInfo.repo_provider}/${hunkInfo.repo_owner}/${hunkInfo.repo_name}`);
	const authorAliases = hunkInfo.prhunkvec.map(prHunk => prHunk.blamevec.map(blameItem => blameItem.author)).flat();

	// update the aliases table
	const insertAliasesQuery = `
		INSERT INTO aliases (git_alias)
		VALUES ${authorAliases.map(alias => `(${convert(alias)})`).join(",")}
		ON CONFLICT (git_alias) DO NOTHING;
	`
	await conn.query(insertAliasesQuery).catch(err => {
		console.error(`[saveNewAuthorAliases] Failed to insert aliases in the db`, { pg_query: insertAliasesQuery }, err);
	});

	// update the aliases in the repos table
	const updateAliasesInReposQuery = `
		UPDATE repos
		SET aliases = array(
			SELECT DISTINCT unnest(aliases || ${convert(authorAliases)})
		)
		WHERE repo_provider = ${convert(hunkInfo.repo_provider)}
			AND repo_owner = ${convert(hunkInfo.repo_owner)}
			AND repo_name = ${convert(hunkInfo.repo_name)};
	`
	await conn.query(updateAliasesInReposQuery).catch(err => {
		console.error(`[saveNewAuthorAliases] Failed to update aliases in repos in the db`, { pg_query: updateAliasesInReposQuery }, err);
	});
}

export const getAuthorAliases = async (alias_email: string) => {
	const users = await getUserByAlias(alias_email);
	for (const user of users ?? []) {
		if (user["aliases"]) {
			return user["aliases"];
		}
	}
	console.error(`[getAuthorAliases] Failed to get author aliases from db of the user with alias ${alias_email}`);
	throw new Error('Cant proceed without author aliases'); //TODO - handle this more gracefully
}

export const getHunkData = async (provider: string, owner: string, repoName: string,
	reviewId: string, userEmails: Set<string>) => {
	const hunk_query = `
		SELECT hunks 
		FROM pr_hunks
		WHERE repo_provider = '${provider}' 
		AND repo_owner = '${owner}'
		AND repo_name = '${repoName}'  
		AND pr_number = '${reviewId}'
	`;
	const result = await conn.query<DbHunks>(hunk_query).catch(err => {
		console.error(`[getHunkData] Unable to get author and hunks from db for review-id ${reviewId} in the repository: ${provider}/${owner}/${repoName}`, { pg_query: hunk_query }, err);
		throw new Error("Unable to proceed without hunk data from db", err);
	});
	const filteredBlamevec = result.rows[0]["hunks"]["blamevec"].filter((obj: HunkInfo) => {
		const hunk_author = obj["author"];
		return userEmails.has(hunk_author);
	});
	return filteredBlamevec;
}

export const getReviewData = async (provider: string, owner: string, repoName: string, user_emails: Set<string>) => {
	const review_query = `
	SELECT pr_number, hunks 
	FROM pr_hunks
	WHERE repo_provider = '${provider}' 
	AND repo_owner = '${owner}'
	AND repo_name = '${repoName}'  
  `;
	const result = await conn.query<DbHunks>(review_query).catch(err => {
		console.error(`[getReviewData] Could not get hunks for repository: ${provider}/${owner}/${repoName}`, { pg_query: review_query }, err);
		throw new Error("Error in running the query on the database", err);
	});
	const filteredRows = result.rows
		.filter((row) => row?.hunks?.blamevec && row?.pr_number)
		.map((row) => {
			const filteredBlamevec = row["hunks"]["blamevec"].filter((obj: HunkInfo) => {
				if (!obj || !("author" in obj)) {
					console.error("[getReviewData/filteredBlamevec] blamevec obj missing keys, obj = ", obj);
					return false;
				}
				const hunk_author = obj["author"].toString();
				return user_emails.has(hunk_author);
			});
			const reviewData = {
				review_id: row["pr_number"].toString(),
				blamevec: filteredBlamevec
			}
			return reviewData;
		});
	return filteredRows;
}

export const getFileData = async (provider: string, owner: string, reponame: string,
	review_id: string, author_emails: Set<string>) => {
	let hunks = await getHunkData(provider, owner, reponame, review_id, author_emails)
		.catch(err => {
			console.error(`[getFileData] Could not get hunks for repository: ${provider}/${owner}/${reponame}`, { pg_query: review_id }, err);
			return [];
		});
	let files = new Set<string>();
	for (const hunk of hunks) {
		files.add(hunk["filepath"]);
	}
	return files;
}

export const getTopicNameFromDB = async (provider: string, owner: string, repoName: string): Promise<string[]> => {
	console.log(`[getTopicNameFromDB] Getting topic name from db ${provider}/${owner}/${repoName}`); //TODO: To be removed
	const query = `
    SELECT install_id 
    FROM repos 
    WHERE repo_provider = '${provider}' AND LOWER(repo_owner) = LOWER('${owner}') AND LOWER(repo_name) = LOWER('${repoName}')
  `;
	const result = await conn.query(query).catch(err => {
		console.error(`[getTopicNameFromDB] Could not get the install-id for repository: ${provider}/${owner}/${repoName}`, { pg_query: query }, err);
		throw new Error("Error in running the query on the database", err);
	});
	if (result.rows.length === 0) {
		throw new Error('No topic found');
	}
	return result.rows[0].install_id;
}

export const saveTopicName = async (owner: string, provider: string, topicName: string, repoNames: string[]) => {
	const rows = repoNames.map(repo => `('${repo}', '${owner}', '${provider}', '${topicName}')`).join(', ');
	const query = `
        INSERT INTO repos (repo_name, repo_owner, repo_provider, install_id) 
        VALUES ${rows}
        ON CONFLICT (repo_name, repo_owner, repo_provider) DO UPDATE SET 
            install_id = EXCLUDED.install_id
    `;
	await conn.query(query).catch(err => {
		console.error(`[saveTopicName] Unable to insert topic name in db`, { pg_query: query }, err)
	});
}

export const createTopicName = async (user_id: string) => {
	console.info(`[createTopicName] creating topic name for user with id: ${user_id}`);
	let topicName = "topic-" + uuidv4();
	if (!topicName) {
		console.error(`[createTopicName] could not create topic name`);
		return null;
	}
	return topicName;
}

export const saveTopicNameInUsersTable = async (userId: string, topicName: string) => {
	console.log(`[saveTopicNameInUsersTable] saving topic name: ${topicName} in users table in db for user_id:  ${userId}`); //TODO: To be removed
	const query = `
    Update users 
    set topic_name = $1 
    WHERE id = $2`;
	await conn.query(query, [topicName, userId]).catch(error => {
		console.error(`[saveTopicNameInUsersTable] Unable to insert topic name in db`, { pg_query: query }, error);
	});
}