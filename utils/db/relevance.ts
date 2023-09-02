import conn from '.';

export const saveHunk = async (hunkInfo: string) => {
  const hunkinfo_json = JSON.parse(hunkInfo);
  console.info("Saving hunk for ", hunkinfo_json.repo_name);
  for (const prHunk of hunkinfo_json.prhunkvec) {
	const hunk_val = JSON.stringify({"blamevec": prHunk.blamevec});
	const hunk_query = `
	  INSERT INTO hunks (repo_provider, repo_owner, 
		repo_name, review_id, author, hunks
		) VALUES ('${hunkinfo_json.repo_provider}',
			'${hunkinfo_json.repo_owner}', 
			'${hunkinfo_json.repo_name}',
			'${prHunk.pr_number}',
			'${prHunk.author}',
			'${hunk_val}')
		ON CONFLICT (repo_provider, repo_owner, repo_name, review_id) DO UPDATE SET 
		hunks = EXCLUDED.hunks
	`;
	await conn.query(hunk_query);
  }
}

export const getAuthorAliases = async (account_id: string, provider: string) => {
	const query = `
	SELECT aliases
	FROM users
	WHERE auth_info -> '${provider}' -> '${account_id}' IS NOT NULL
	`
	const res = await conn.query(query);
	return res.rows[0]["aliases"];
}

export const getHunkData = async (provider: string, owner: string, reponame: string, 
	review_id: string, user_emails: Set<string>) => {
	const hunk_query = `
		SELECT author, hunks 
		FROM hunks
		WHERE repo_provider = '${provider}' 
		AND repo_owner = '${owner}'
		AND repo_name = '${reponame}'  
		AND review_id = '${review_id}'
	`;
	const result = await conn.query(hunk_query);
	const author_aliases = await getAuthorAliases(result.rows[0]["author"], provider);
	const filteredBlamevec = result.rows[0]["hunks"]["blamevec"].filter((obj: { [x: string]: string; }) => {
		const hunk_author = obj["author"].toString();
      	return (!(author_aliases.includes(hunk_author)) && user_emails.has(hunk_author)); 
	});
	return filteredBlamevec;
}

export const getReviewData = async (provider: string, owner: string, reponame: string, user_emails: Set<string>) => {
	const review_query = `
	SELECT review_id, author, hunks 
	FROM hunks
	WHERE repo_provider = '${provider}' 
	AND repo_owner = '${owner}'
	AND repo_name = '${reponame}'  
  `;
  const result = await conn.query(review_query);
  const filteredRows = result.rows.map(async (row: any) => {
	const author_aliases = await getAuthorAliases(row["author"].toString(), provider);
    const filteredBlamevec = row["hunks"]["blamevec"].filter((obj: {[key: string]: string}) => {
		const hunk_author = obj["author"].toString();
      	return (!(author_aliases.includes(hunk_author)) && user_emails.has(hunk_author));
    });
    const reviewData = {
		review_id: row["review_id"].toString(),
		blamevec: filteredBlamevec
	}
    return reviewData;
  });
  return filteredRows;
}

export const getFileData = async (provider: string, owner: string, reponame: string, 
	review_id: string, author_emails: Set<string>) => {
  let hunks = await getHunkData(provider, owner, reponame, review_id, author_emails);
  let files =  new Set<string>();
  for (const hunk in hunks) {
	files.add(hunks[hunk]["filepath"]);
  }
  return files;
}

export const getTopicNameFromDB = async (owner: string, repoName: string, provider: string): Promise<string> => {
  const query = `
    SELECT install_id 
    FROM repos 
    WHERE repo_owner = '${owner}' AND repo_provider = '${provider}' AND repo_name = '${repoName}'
  `;
  const result = await conn.query(query);
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
    await conn.query(query);
}