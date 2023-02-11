import { useState, useEffect } from 'react';
import { ResponsiveVoronoi, VoronoiDatum } from '@nivo/voronoi'
import { ContributorVector, ContributorAggregates } from '../../types/contributor';
import { centralLimit, countArrayElements } from "../../utils/data";
import { Pool, QueryResult } from 'pg';

const Contributors2DView = (props: { repo_data: Array<VoronoiDatum> }) => {
	return (
		<ResponsiveVoronoi
			data={props.repo_data}
			xDomain={[-60_000_000_000, 42_000_000_000]}
			yDomain={[-20_000_000_000, 42_000_000_000]}
			enableLinks={true}
			linkLineColor="#cccccc"
			cellLineColor="#c6432d"
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
		FROM devraw 
	WHERE (commit_json ->> 'repo_name')='${repo_name}'
		GROUP BY author_email
		ORDER BY num_commits DESC`;
	const result = await conn.query(user_agg_commits_q);

	const author_info: Array<ContributorAggregates> = [];
	const author_vec_promises = [];
	for (const author of result.rows) {
		if (author.num_commits < 10) {
			// ignore author
			continue;
		}

		const author_vec_q = `SELECT
			langs,
			(commit_json -> 'parents') as parents,
			((commit_json -> 'diff_info') ->> 'insertions') as diff_insertions,
			((commit_json -> 'diff_info') ->> 'deletions') as diff_deletions,
			((commit_json -> 'diff_info') ->> 'files_changed') as diff_files_changed,
			((commit_json -> 'diff_info') -> 'file_info') as diff_file_info
			FROM devraw
		WHERE (commit_json ->> 'repo_name')='${repo_name}' AND author_email='${author.author_email}'
			`;

		author_info.push({
			author_email: author.author_email,
			num_commits: parseInt(author.num_commits),
			first_commit_ts: new Date(author.first_commit_ts).getTime(),
			last_commit_ts: new Date(author.last_commit_ts).getTime(),
		});
		author_vec_promises.push(conn.query(author_vec_q));
	}

	const contri_data: Array<ContributorVector> = []
	const responses = await Promise.allSettled(author_vec_promises)
	for (let i = 0; i < author_info.length; i++) {
		const author = author_info[i];
		if (responses[i].status === "fulfilled") {
			const vec = (responses[i] as PromiseFulfilledResult<QueryResult<any>>).value.rows;

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
			contri_data.push({
				...author,
				commits: commit_summary,
			})
		} else {
			console.error((responses[i] as PromiseRejectedResult | undefined)?.reason);
		}
	}

	const contri_vec: { [key: string]: Array<number> } = {};
	for (const contri of contri_data) {
		const { author_email, commits, ...others } = contri;
		contri_vec[author_email] = [...Object.values(others), ...Object.values(commits)];
	}

	const PCA = await import('pca-js');
	let vectors = PCA.getEigenVectors(Object.values(contri_vec));

	var topTwo = PCA.computePercentageExplained(vectors, vectors[0], vectors[1])
	console.log(topTwo);

	const adData = PCA.computeAdjustedData(Object.values(contri_vec), vectors[0], vectors[1]);
	const chart_data: Array<VoronoiDatum> = Object.keys(contri_vec).map((contri_email, i) => ({
		id: contri_email,
		x: adData.formattedAdjustedData[0][i],
		y: adData.formattedAdjustedData[1][i],
	}))

	console.log(chart_data);
	return chart_data;
}

export default Contributors2DView;