import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html className='scroll-smooth font-custom'>
			<Head>
				<title>DevProfile: The Ultimate Developer Profile</title>
				<meta name="description" content="Build your developer profile directly from your code's version history" />
				<link rel="icon" href="/favicon.ico" />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='true'
				/>
				<link
					href='https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
