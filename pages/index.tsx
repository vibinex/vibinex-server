import MainAppBar from '../views/MainAppBar'

export default function Home() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center py-2 container mx-auto'>
			<MainAppBar />
			<h1 className='text-3xl font-bold underline'>Developer Profile</h1>
			<div className='bg-gray-100 h-screen w-full'>Placeholder</div>
			<footer className='fixed bottom-0 bg-gray-200 w-full'>Alokit Innovations Private Limited</footer>
		</div>
	)
}