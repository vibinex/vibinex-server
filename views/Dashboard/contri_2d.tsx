import { useState, useEffect } from 'react';
import { ResponsiveVoronoi, VoronoiDatum } from '@nivo/voronoi'
import { ContributorVector } from '../../types/contributor';
import { centralLimit, countArrayElements } from "../../utils/data";
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

export async function getContri2DProps(conn: Pool, repo_name: string) {
	const user_agg_commits_q = `SELECT
		author_email,
		count(*) as num_commits,
		min(ts) as first_commit_ts,
		max(ts) as last_commit_ts
		FROM commits 
		WHERE (commit_json ->> 'repo_name')='${repo_name}'
		GROUP BY author_email
		ORDER BY last_commit_ts DESC`;
	const result = await conn.query(user_agg_commits_q);

	const author_vec_q = `SELECT
			langs,
			(commit_json -> 'parents') as parents,
			((commit_json -> 'diff_info') ->> 'insertions') as diff_insertions,
			((commit_json -> 'diff_info') ->> 'deletions') as diff_deletions,
			((commit_json -> 'diff_info') ->> 'files_changed') as diff_files_changed,
			((commit_json -> 'diff_info') -> 'file_info') as diff_file_info,
			author_email
		FROM commits
		WHERE (commit_json ->> 'repo_name')='${repo_name}'`;
	const author_vec_result = await conn.query(author_vec_q);

	const author_vec: Array<ContributorVector> = []
	for (const author of result.rows) {
		if (parseInt(author.num_commits) < 10)
			continue;
		const vec = author_vec_result.rows.filter((row) => row.author_email === author.author_email);
		for (let row of vec) {
			row.langs = countArrayElements(row.langs);
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
			first_commit_ts: new Date(author.first_commit_ts).getTime(),
			last_commit_ts: new Date(author.last_commit_ts).getTime(),
			commits: commit_summary,
		})
	}

	return author_vec;
}

export default Contributors2DView;