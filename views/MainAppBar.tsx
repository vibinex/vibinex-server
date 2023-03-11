import AppBar from '../components/AppBar'
import Button from '../components/Button'
import Image from "next/image";
import { getAuthUserImage, getAuthUserName, logout } from '../utils/auth';
import { useSession } from 'next-auth/react';

export default function MainAppBar() {
	const { data: session } = useSession();
	return (
		<AppBar position='fixed' className='w-full flex flex-row'>
			<a href="/" className="mr-16 h-full overflow-clip flex flex-row items-center">
				<img src="/black-logo.svg" alt="Dev Profile Logo" className="h-full w-auto mr-2" />
			</a>
			<span className='flex-grow'></span>
			<Button variant='text' href='https://github.com/Alokit-Innovations/dev-profile-website' target='_blank' className='text-white'>Contribute</Button>
			<Image src={getAuthUserImage(session)} onClick={() => logout()} alt="Display picture" title={getAuthUserName(session)} width={300} height={300} className="h-full w-auto hover:cursor-pointer" />
		</AppBar>
	)
}