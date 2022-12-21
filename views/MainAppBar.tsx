import AppBar from '../components/AppBar'
import Button from '../components/Button'

export default function MainAppBar() {
	return (
		<AppBar position='fixed' className='w-full flex flex-row'>
			<a href="/" className="mr-16 h-full overflow-clip flex flex-row items-center">
				<img src="/DevProfile.Tech Logo v1.2.png" alt="Dev Profile Logo" className="h-full w-auto mr-2" />
				<h1 className='w-auto text-2xl text-white'>DevProfile.Tech</h1>
			</a>
			<span className='flex-grow'></span>
			<Button variant='text' href='https://github.com/Alokit-Innovations/dev-profile-website' target='_blank' className='text-white'>Contribute</Button>
			<Button variant='contained' href='/login' className='mx-1 ml-4'>Login</Button>
		</AppBar>
	)
}