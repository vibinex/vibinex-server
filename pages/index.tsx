import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>DevProfile: The Ultimate Developer Profile</title>
				<meta name="description" content="Build your developer profile directly from your code's version history" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1>Developer Profile</h1>
			<footer>Alokit Innovations Private Limited</footer>
		</div>
	)
}