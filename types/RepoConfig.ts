export type RepoConfig = {
	auto_assign: boolean,
	comment: boolean,
	diff_graph: boolean,
}

export type RepoConfigOptions = 'auto_assign' | 'comment' | 'diff_graph';

export const RepoConfigDbMap : Record<RepoConfigOptions, string> = {
	auto_assign: 'auto_assign',
	comment: 'comment_setting',
	diff_graph: 'diff_graph',
}

export const RepoConfigDisplayMap: Record<RepoConfigOptions, string> = {
	auto_assign: 'Auto-assign reviewers',
	comment: 'Relevance comment',
	diff_graph: 'Diff-Graph comment',
}

export const isValidConfigOption = (configOption: string): configOption is RepoConfigOptions => {
	return Object.keys(RepoConfigDbMap).includes(configOption as RepoConfigOptions);
};

export const defaultRepoConfigForTeams: RepoConfig = {
	auto_assign: true,
	comment: true,
	diff_graph: false,
}

export const defaultRepoConfigForIndividuals: RepoConfig = {
	auto_assign: false,
	comment: false,
	diff_graph: false,
}