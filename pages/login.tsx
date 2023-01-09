import axios from "axios";
import { NextPage } from "next"
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getURLWithParams } from '../utils/url_utils';

const LoginPage: NextPage = () => {
	const router = useRouter();
	const [name, setName] = useState("User");
	const [profilePic, setProfilePic] = useState("/../public/dummy-profile-pic-female-300n300.jpeg");
	useEffect(() => {
		console.log(router.query.name);
		if ((Object.keys(router.query).length != 0) && ('name' in router.query)) {
			if (router.query.name && typeof router.query.name === "string") setName(router.query.name);
			console.log(router.query.profilePic);
			// if (router.query.profilePic && typeof router.query.profilePic === "string") setProfilePic(router.query.profilePic);
		}
	}, [router]);
	// step 2: request an authorization code
	const linkedinLoginURL = getURLWithParams("https://www.linkedin.com/oauth/v2/authorization", {
		response_type: "code",
		client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
		redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
		state: process.env.NEXT_PUBLIC_LINKEDIN_STATE,
		scope: "r_emailaddress r_liteprofile"
	})
	return ((name !== "User") ?
		<div>
			<Image src={profilePic} alt="Display picture" width={300} height={300} />
			Welcome {name}!
		</div> :
		<div className="container mx-auto mt-4">
			<Head>
				<title>Login: DevProfile</title>
			</Head>
			<h1 className="text-3xl text-center">
				<Link href="/">DevProfile.Tech</Link>
			</h1>
			<Link href={linkedinLoginURL} >
				<Image src={'/../public/signin_with_linkedin-buttons/Retina/Sign-In-Large---Default.png'} alt="Linkedin Login" width={430} height={80} className="w-full" />
			</Link>
		</div>
	);
}

export default LoginPage;