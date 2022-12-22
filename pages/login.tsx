import { NextPage } from "next"
import Head from "next/head";
import Button from '../components/Button'

const LoginPage: NextPage = () => {
	return (
		<div className="container mx-auto mt-4">
			<Head>
				<title>Login: DevProfile</title>
			</Head>
			<h1 className="text-3xl text-center">
				<a href="/">DevProfile.Tech</a>
			</h1>
			<form method="post" action="#" className="mx-auto p-4 my-8 rounded border-solid border-black border-2 max-w-xs flex flex-col space-y-2 bg-gray-100">
				<h3 className="font-semibold text-2xl">Login</h3>
				<input type={'text'} placeholder="Email" name="email" className="rounded" />
				<input type={'password'} placeholder="Password" name="password" className="rounded" />
				<input type={'submit'} value="Sign in" className="hover:cursor-pointer py-2 bg-green-300 rounded" />
				<Button variant="contained" className="py-3 w-full">Login with Linkedin</Button>
			</form>
		</div>
	)
}

export default LoginPage;