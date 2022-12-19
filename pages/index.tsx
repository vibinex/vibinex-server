import Head from 'next/head'

export default function Home() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center py-2'>
			<Head>
				<title>DevProfile: The Ultimate Developer Profile</title>
				<meta name="description" content="Build your developer profile directly from your code's version history" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1 className='text-3xl font-bold underline'>Developer Profile</h1>
			<footer>Alokit Innovations Private Limited</footer>
		</div>
	)
}