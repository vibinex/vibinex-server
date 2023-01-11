import { NextPage } from "next"
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getURLWithParams } from '../utils/url_utils';
import standingMan from '../public/standingMan.png'

const LoginPage: NextPage = () => {
	const router = useRouter();
	const [name, setName] = useState("User");
	const [profilePic, setProfilePic] = useState("/../public/dummy-profile-pic-female-300n300.jpeg");
	useEffect(() => {
		if ((Object.keys(router.query).length != 0) && ('name' in router.query)) {
			if (router.query.name && typeof router.query.name === "string") setName(router.query.name);
			if (router.query.profilePic && typeof router.query.profilePic === "string") {
				setProfilePic(router.query.profilePic);
			}
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

		<div className="h-screen  p-4 pt-10">
			<Head>
				<title>Login: DevProfile</title>
			</Head>
			<div className="sm:mt-20 sm:border-y-2 border-primary-text rounded p-5 sm:w-[50%] m-auto">
				<div className="sm:flex justify-center">

					<Image src={standingMan} alt='login page illustration' className="sm:h-[30rem] h-[18rem] sm:w-[12rem] w-[8rem] m-auto" />

					<div className="p-4 pl-10 text-center">
						<h2 className="font-bold text-[30px]  underline underline-offset-2 m-5">Sign up</h2>
						<p className="mb-10">Sign up with LinkedIn. So, you don&apos;t need to write about yourself again.</p>

						<Link href={linkedinLoginURL}>
							{/* TODO: We need to change the image based on screen size and pseudo-classes like hover and active */}
							<Image src={'/../public/signin_with_linkedin-buttons/Retina/Sign-In-Large---Default.png'} alt="Linkedin Login" width={430} height={80} className="w-full" />
						</Link>

						<div className="mt-10 text-primary-text text-[15px]">
							<p>By signing up you accept devProfile&apos;s <Link href={'/policy'}><span className="text-primary-main">Privacy Policy</span></Link> and <Link href={'/terms'}><span className="text-primary-main">T&C</span></Link>.</p>
							<hr />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;