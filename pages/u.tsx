import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainAppBar from "../views/MainAppBar";
import conn from '../utils/db';
import { NextPage } from "next";
import { QueryResult } from "pg";
import { centralLimit, countArrayElements } from "../utils/data";
import { ResponsiveVoronoi, VoronoiDatum } from '@nivo/voronoi'

const Profile: NextPage<{ repo_data: Array<AuthorVector> }> = ({ repo_data }) => {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [data, setData] = useState<Array<VoronoiDatum>>([]);
	useEffect(() => {
		// check if devProfile already exists. Redirect to upload page if it doesn't
		if (false)
			window.location.href = "/upload";
	}, [])
	useEffect(() => {
		// Setting user information in localStorage immediately after login
		if ((Object.keys(router.query).length != 0) && ('name' in router.query)) {
			if (router.query.name && typeof router.query.name === "string") {
				localStorage.setItem('name', router.query.name);
			}
			if (router.query.profilePic && typeof router.query.profilePic === "string") {
				localStorage.setItem('displayPic', router.query.profilePic);
			}
			setIsLoggedIn(true);
		}
	}, [router]);
	useEffect(() => {
		const formatted_data = repo_data.map(c => ({ id: c.author_email, x: c.num_commits, y: c.commits.diff_files_changed }));
		console.log(formatted_data);
		setData(formatted_data);
	}, [repo_data]);
	return (
		<>
			<MainAppBar isLoggedIn={isLoggedIn} />
			<p>This is the developer profile</p>
			<div className="block w-48 h-48">
				<ResponsiveVoronoi
					data={data}
					xDomain={[0, 100]}
					yDomain={[0, 30]}
					enableLinks={true}
					linkLineColor="#cccccc"
					cellLineColor="#c6432d"
					pointSize={6}
					pointColor="#c6432d"
					margin={{ top: 1, right: 1, bottom: 1, left: 1 }}
				/>
			</div>
			<p>{JSON.stringify(repo_data)}</p>
		</>
	)
}

Profile.getInitialProps = async () => {
	/* FIXME: to be removed : placeholder values */
	const repo_name = "mentorship-website"; // this should come from the context's

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

	const author_info: Array<AuthorAggregates> = [];
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

	const author_vec: Array<AuthorVector> = []
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
				parents: centralLimit('avg', vec.map(row => parseInt(row.parents))),
				diff_insertions: centralLimit('avg', vec.map(row => parseInt(row.diff_insertions))),
				diff_deletions: centralLimit('avg', vec.map(row => parseInt(row.diff_deletions))),
				diff_files_changed: centralLimit('avg', vec.map(row => parseInt(row.diff_files_changed))),
				langs: centralLimit('avg', vec.map(row => (row.langs.javascript) ? row.langs.javascript : null)),
			}
			author_vec.push({
				...author,
				commits: commit_summary,
			})
		} else {
			console.error((responses[i] as PromiseRejectedResult | undefined)?.reason);
		}
	}

	return {
		repo_data: author_vec
	}
}

// TODO: create a separate file that handles the types of the objects that we want from postgres
type AuthorAggregates = {
	author_email: string,
	num_commits: number,
	first_commit_ts: number,
	last_commit_ts: number,
}

type AuthorVector = {
	author_email: string,
	num_commits: number,
	first_commit_ts: number,
	last_commit_ts: number,
	commits: object,
}

export default Profile;