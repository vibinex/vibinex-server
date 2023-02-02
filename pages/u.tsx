import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainAppBar from "../views/MainAppBar";
import conn from '../utils/db';
import { NextPageContext } from "next";

export default function Profile(data: { repo_data: any }) {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		// check if devProfile already exists. Redirect to upload page if it doesn't
		if (false) {
			window.location.href = "/upload";
		}
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

	let result = await conn.query(
		`SELECT 
			author_email, 
			count(*) as num_commits 
		FROM devraw 
		WHERE (commit_json ->> 'repo_name')='${repo_name}' 
		GROUP BY author_email
		ORDER BY num_commits DESC`
	)
	console.log(result.rowCount);
	console.log(result.rows[0]);

	return {
		repo_data: result
	}
}