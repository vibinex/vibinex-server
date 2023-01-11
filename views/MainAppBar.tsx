import AppBar from '../components/AppBar'
import Button from '../components/Button'
import Image from "next/image";
import { useState, useEffect } from "react";

export default function MainAppBar({ isLoggedIn }: { isLoggedIn?: boolean }) {
	const [name, setName] = useState('');
	const [profilePic, setProfilePic] = useState("/../public/dummy-profile-pic-female-300n300.jpeg");

	useEffect(() => {
		if (localStorage.getItem("name") && localStorage.getItem('displayPic')) {
			const name_var = localStorage.getItem("name");
			const profilePic_var = localStorage.getItem('displayPic');
			setName(name_var != null ? name_var : name);
			setProfilePic(profilePic_var ? profilePic_var : profilePic);
			isLoggedIn = true;
		}
		// FIXME: If the user is not logged in, redirect from here, if there is no middleware to handle that
		// TODO: If the user is logged in, check if they already have a profile. Redirect to /u if they do
	}, [isLoggedIn]);

	function logOut() {
		// FIXME: Ideally, directly clicking on the profile shouldn't log out. It should show a menu first
		if (typeof window !== 'undefined') {
			window.localStorage.clear();
			console.info("logging out..");
			window.location.href = "/";
		}
	}
	return (
		<AppBar position='fixed' className='w-full flex flex-row'>
			<a href="/" className="mr-16 h-full overflow-clip flex flex-row items-center">
				<img src="/DevProfile.Tech Logo v1.2.png" alt="Dev Profile Logo" className="h-full w-auto mr-2" />
				<h1 className='w-auto text-2xl text-white'>devProfile</h1>
			</a>
			<span className='flex-grow'></span>
			<Button variant='text' href='https://github.com/Alokit-Innovations/dev-profile-website' target='_blank' className='text-white'>Contribute</Button>
			<Image src={profilePic} onClick={logOut} alt="Display picture" title={name} width={300} height={300} className="h-full w-auto hover:cursor-pointer" />
		</AppBar>
	)
}