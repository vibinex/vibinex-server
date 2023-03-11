import AppBar from '../components/AppBar'
import Button from '../components/Button'
import Image from "next/image";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react"

export default function MainAppBar({ isLoggedIn }: { isLoggedIn?: boolean }) {
	const [name, setName] = useState('');
	const [profilePic, setProfilePic] = useState("/../public/dummy-profile-pic-female-300n300.jpeg");
	const [showMenu,setShowMenu] = useState(false);

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

	return (
		<AppBar position='fixed' className='w-full py-2 px-10 flex flex-row bg-primary-light border-b-2 border-b-secondary-dark'>
			<a href="/" className="mr-16 h-full overflow-clip flex flex-row items-center">
				<h1 className='font-bold text-3xl sm:text-4xl'>
					Vibinex
				</h1>
			</a>
			<span className='flex-grow'></span>
			<Image src={profilePic} onClick={() => setShowMenu(prev=>!prev)} alt="Display picture" title={name} width={300} height={300} className="h-full w-auto hover:cursor-pointer rounded-xl cursor-pointer" />
			{/* Log out Pop up  */}
			{showMenu ?
				<ol className='w-[40%] sm:w-[15%] p-3 rounded-md absolute  right-5 sm:right-10 top-16 border-2 bg-primary-light'>
					<li className='bg-primary-main p-2 text-center rounded-md cursor-pointer' onClick={() => signOut()}>
						<h2 className='text-primary-light'>Logout</h2>
					</li>
				</ol>
				:
				null
			}
		</AppBar>
	)
};