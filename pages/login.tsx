import axios from "axios";
import { NextPage } from "next"
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getURLWithParams } from '../utils/url_utils';

const LoginPage: NextPage = () => {
	const router = useRouter();
	const [name, setName] = useState("");
	const [profilePic, setProfilePic] = useState("");
	if ((Object.keys(router.query).length != 0) &&
		('state' in router.query) && ('code' in router.query) &&
		(router.query.state === process.env.NEXT_PUBLIC_LINKEDIN_STATE)) {
		axios.get("https://api.linkedin.com/v2/me").then((res) => {
			// save the id and the code
			// update the name and the profile picture
			setName(res.data.firstName + " " + res.data.lastName);
			setProfilePic(res.data.profilePicture);
		})
		return (
			<div>
				<Image src={profilePic} alt="Display picture" />
				Welcome {name}!
			</div>
		)
	} else {
		const linkedinLoginURL = getURLWithParams("https://www.linkedin.com/oauth/v2/authorization", {
			response_type: "code",
			client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
			redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
			state: process.env.NEXT_PUBLIC_LINKEDIN_STATE,
			scope: "r_emailaddress r_liteprofile"
		})

		return (
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
		)
	}
}

export default LoginPage;