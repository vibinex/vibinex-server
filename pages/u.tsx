import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainAppBar from "../views/MainAppBar";
import { PrismaClient } from '@prisma/client'
import { NextPageContext } from "next";

export default function Profile(data: { repo_data: object | null }) {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		// check if devProfile already exists. Redirect to upload page if it doesn't
		if (false)
			window.location.href = "/upload"
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
			<p>{JSON.stringify(data.repo_data)}</p>
		</>
	)
}

Profile.getInitialProps = async (ctx: NextPageContext) => {
	const my_repo = "mentorship-website";
	const prisma = new PrismaClient();
	const result: object | null = await prisma.temp_devraw.groupBy({
		by: ['author_email'],
		_count: {
			commit_id: true,
		},
		where: {
			commit_json: {
				path: ['repo_name'],
				equals: my_repo,
			}
		}
	});
	return {
		repo_data: result
	}
}