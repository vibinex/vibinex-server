import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainAppBar from "../views/MainAppBar";
import conn from '../utils/db';
import { NextPageContext } from "next";
import { QueryResult } from "pg";

export default function Profile(data: { repo_data: any }) {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		// check if devProfile already exists. Redirect to upload page if it doesn't
		if (false)
			window.location.href = "/upload";
		console.log(data.repo_data);
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
	return (
		<>
			<MainAppBar isLoggedIn={isLoggedIn} />
			<p>This is the developer profile</p>
			<p>{JSON.stringify(data)}</p>
		</>
	)
}

Profile.getInitialProps = async (ctx: NextPageContext) => {
	/* FIXME: to be removed : placeholder values */
	const repo_name = "mentorship-website";

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

		author_info.push(author);
		author_vec_promises.push(conn.query(author_vec_q));
	}

	const author_vec: Array<AuthorVector> = []
	const responses = await Promise.allSettled(author_vec_promises)
	for (let i = 0; i < author_info.length; i++) {
		const author = author_info[i];
		if (responses[i].status === "fulfilled") {
			const vec = (responses[i] as PromiseFulfilledResult<QueryResult<any>>).value.rows;
			author_vec.push({
				...author,
				commits: vec,
			})
		} else {
			console.error((responses[i] as PromiseRejectedResult | undefined)?.reason);
		}
	}

	return {
		repo_data: author_vec
	}
}

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
	commits: Array<object>,
}