import conn from '.';


export async function saveHunk(hunkInfo: string) {
  const hunkinfo_json = JSON.parse(hunkInfo);
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
	console.log(hunk_query);
	const res = await conn.query(hunk_query);
	console.log(res);
  }
}

export async function getAuthorAliases(account_id: String, provider: String) {
	const query = `
	SELECT aliases
	FROM users
	WHERE auth_info -> '${provider}' -> '${account_id}' IS NOT NULL
	`
	const res = await conn.query(query);
	console.log(res);
	return res.rows[0]["aliases"];
}

export async function getHunkData(provider: String, owner: String, reponame: String, 
	review_id: String, user_emails: Set<String>) {
	const hunk_query = `
		SELECT hunks 
		FROM hunks
		WHERE repo_provider = '${provider}' 
		AND repo_owner = '${owner}'
		AND repo_name = '${reponame}'  
		AND review_id = '${review_id}'
	`;
	const result = await conn.query(hunk_query);
	const filteredBlamevec = result.rows[0]["hunks"]["blamevec"].filter((obj: { [x: string]: String; }) => {
		return user_emails.has(obj["author"]); 
	});
	return filteredBlamevec;
}

export async function getReviewData(provider: String, owner: String, reponame: String, user_emails: Set<String>) {
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
    const filteredBlamevec = row["hunks"]["blamevec"].filter((obj: {[key: string]: String}) => {
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

export async function getFileData(provider: String, owner: String, reponame: String, 
	review_id: String, author_emails: Set<String>) {
  let hunks = await getHunkData(provider, owner, reponame, review_id, author_emails);
  let files =  new Set<String>();
  for (const hunk in hunks) {
	files.add(hunks[hunk]["filepath"]);
  }
  console.log("files = ", files);
  return files;
}