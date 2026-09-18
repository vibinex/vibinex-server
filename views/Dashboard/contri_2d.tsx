import { useState, useEffect } from 'react';
import { ResponsiveVoronoi, VoronoiDatum } from '@nivo/voronoi'
import { ContributorVector } from '../../types/contributor';
import type { RepoIdentifier } from '../../types/repository';
import { centralLimit, countArrayElements } from "../../utils/data";
import { supportedProviders } from '../../utils/providerAPI';
import { Pool } from 'pg';

const Contributors2DView = (props: { repo_data: Array<ContributorVector> }) => {
	const [data, setData] = useState<Array<VoronoiDatum>>([]);

	useEffect(() => {
		const formatted_data = props.repo_data.map(c => ({ id: c.author_email, x: c.num_commits, y: c.commits.diff_files_changed }));
		setData(formatted_data);
	}, [props]);

	return (
		<ResponsiveVoronoi
			data={data}
			xDomain={[Math.min(...data.map(d => d.x)) * 0.9, Math.max(...data.map(d => d.x)) * 1.01]}
			yDomain={[Math.min(...data.map(d => d.y)) * 0.9, Math.max(...data.map(d => d.y)) * 1.01]}
			enableLinks={true}
			linkLineColor="#cccccc"
			cellLineColor="#c6432d"
			enableCells={false}
			pointSize={6}
			pointColor="#c6432d"
			margin={{ top: 1, right: 1, bottom: 1, left: 1 }}
		/>
	)
}

const repositorySegmentPattern = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;

export const parseRepoAddress = (repoAddress: string): RepoIdentifier | null => {
	const [repo_provider, repo_owner, repo_name, ...extraSegments] = repoAddress.split('/');
	if (
		extraSegments.length > 0 ||
		!supportedProviders.includes(repo_provider as typeof supportedProviders[number]) ||
		!repositorySegmentPattern.test(repo_owner) ||
		!repositorySegmentPattern.test(repo_name)
	) {
		return null;
	}

	return { repo_provider: repo_provider as RepoIdentifier['repo_provider'], repo_owner, repo_name };
};

export async function getContri2DProps(conn: Pool, repo: RepoIdentifier, userId: string) {
	const authorizedRepo = await conn.query(
		`SELECT 1
		 FROM repos r
		 JOIN repo_config rc ON rc.repo_id = r.id
		 WHERE r.repo_provider = $1
			AND r.repo_owner = $2
			AND r.repo_name = $3
			AND rc.user_id = $4
		 LIMIT 1`,
		[repo.repo_provider, repo.repo_owner, repo.repo_name, userId]
	);

	if (authorizedRepo.rowCount === 0) {
		return [];
	}

	const user_agg_commits_q = `SELECT
		author_email,
		count(*) as num_commits,
		min(commit_json ->> 'ts_secs') as first_commit_ts,
		max(commit_json ->> 'ts_secs') as last_commit_ts
		FROM commits 
		WHERE (commit_json ->> 'repo_name') = $1
		GROUP BY author_email
		ORDER BY last_commit_ts DESC`;
	const result = await conn.query(user_agg_commits_q, [repo.repo_name]);

	const author_vec_q = `SELECT
			(commit_json -> 'parents') as parents,
			((commit_json -> 'diff_info') ->> 'insertions') as diff_insertions,
			((commit_json -> 'diff_info') ->> 'deletions') as diff_deletions,
			((commit_json -> 'diff_info') ->> 'files_changed') as diff_files_changed,
			((commit_json -> 'diff_info') -> 'file_info') as diff_file_info,
			author_email
		FROM commits
		WHERE (commit_json ->> 'repo_name') = $1`;
	const author_vec_result = await conn.query(author_vec_q, [repo.repo_name]);

	const author_vec: Array<ContributorVector> = []
	for (const author of result.rows) {
		if (parseInt(author.num_commits) < 10)
			continue;
		const vec = author_vec_result.rows.filter((row) => row.author_email === author.author_email);
		for (let row of vec) {
			row.langs = countArrayElements(row.diff_file_info.map((fi: { v_language: string, path_hash: string, filename: string }) => fi.v_language));
			row.parents = row.parents.length;
			delete row.diff_file_info;
		}
		const commit_summary = {
			parents: centralLimit('avg', vec.map(row => parseInt(row.parents)))!,
			diff_insertions: centralLimit('avg', vec.map(row => parseInt(row.diff_insertions)))!,
			diff_deletions: centralLimit('avg', vec.map(row => parseInt(row.diff_deletions)))!,
			diff_files_changed: centralLimit('avg', vec.map(row => parseInt(row.diff_files_changed)))!,
			langs: centralLimit('avg', vec.map(row => (row.langs.javascript) ? row.langs.javascript : null))!,
		}
		author_vec.push({
			author_email: author.author_email,
			num_commits: parseInt(author.num_commits),
			first_commit_ts: parseInt(author.first_commit_ts),
			last_commit_ts: parseInt(author.last_commit_ts),
			commits: commit_summary,
		})
	}

	return author_vec;
}

export default Contributors2DView;