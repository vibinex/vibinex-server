import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainAppBar from "../views/MainAppBar";

const Profile = () => {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		// check if devProfile already exists. Redirect to upload page if it doesn't
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
	return (
		<>
			<MainAppBar isLoggedIn={isLoggedIn} />
			<p>This is the developer profile</p>
		</>
	)
}

export default Profile;