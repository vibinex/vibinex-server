import AppBar from '../components/AppBar'
import LoginLogout from '../components/LoginLogout';

export default function MainAppBar() {
	return (
		<AppBar position='fixed' className='w-full py-2 px-10 flex flex-row bg-primary-light border-b-2 border-b-secondary-dark'>
			<a href="/" className="mr-16 h-full overflow-clip flex flex-row items-center">
				<h1 className='font-bold text-3xl sm:text-4xl'>
					Vibinex
				</h1>
			</a>
			<span className='flex-grow'></span>
			<LoginLogout />
		</AppBar>
	)
};