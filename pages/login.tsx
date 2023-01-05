import { NextPage } from "next"
import Link from "next/link";
import standingMan from '../public/standingMan.png'
import Image from "next/image";

const LoginPage: NextPage = () => {
	return (

		<div className="h-screen  p-4 pt-10">
			<div className="sm:mt-20 sm:border-y-2 border-primary-text rounded p-5 sm:w-[50%] m-auto">
				<div className="sm:flex justify-center">

					<Image src={standingMan} alt='login page illustration' className="sm:h-[30rem] h-[18rem] sm:w-[12rem] w-[8rem] m-auto" />

					<div className="p-4 pl-10 text-center">
						<h2 className="font-bold text-[30px]  underline underline-offset-2 m-5">Sign up</h2>
						<p className="mb-10">Easy Signup with LinkedIn. So, you do not need to write about yourself again while building devProfile.</p>

						<Link href={'/'} className=''>
							<div className="flex bg-primary-main p-4 font-bold text-primary-light rounded justify-center">
								<h2 className="ml-2 text-[18px]  mt-0.2">Continue with LinkedIn</h2>
							</div>
						</Link>

						<Link href={'/'} className=''>
							<div className="flex bg-black p-4 font-bold text-primary-light rounded justify-center align-bottom mt-10">

								<h2 className="ml-2 text-[18px] mt-0.2">Go to Home</h2>
							</div>
						</Link>

						<div className="mt-10 text-primary-text text-[15px]">
							<p>By signing up you accept devProfile&apos;s <Link href={'/policy'}><span className="text-primary-main">Privacy Policy</span></Link> and <Link href={'/terms'}><span className="text-primary-main">T&C</span></Link>.</p>
							<hr />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoginPage;