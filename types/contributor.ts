// TODO: create a separate file that handles the types of the objects that we want from postgres
export type ContributorVector = {
	author_email: string,
	num_commits: number,
	first_commit_ts: number,
	last_commit_ts: number,
	commits: {
		parents: number,
		diff_insertions: number,
		diff_deletions: number,
		diff_files_changed: number,
		langs: number,
	},
}
