"use client";

import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Button from "../../components/Button";
import { getProviderLogoSrc } from "../../components/ProviderLogo";
import VibinexDarkLogo from '../../public/vibinex-dark-logo.png';
import VibinexLightLogo from '../../public/vibinex-light-logo.png';
import type { RepoProvider } from "../../utils/providerAPI";
import { getPreferredTheme, type Theme } from "../../utils/theme";
import { authOptions } from "../api/auth/[...nextauth]";

const SignInPage = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const theme = getPreferredTheme();
	const vibinexLogo = (theme: Theme) => theme === 'dark' ? VibinexDarkLogo : VibinexLightLogo;
	return (
		<div className="h-screen  p-4 pt-10">
			<Head>
				<title>Login to Vibinex</title>
			</Head>
			<div className="sm:mt-20 sm:border-y-2 border-primary-text rounded p-5 sm:w-[50%] m-auto">
				<div className="p-4 text-center flex flex-col">
					<Image src={vibinexLogo(theme)} alt='login page illustration' className="m-auto w-24" />
					<h2 className="font-bold text-[30px] m-5">Sign in to Vibinex</h2>
					<p className="mb-10">Sign in with your code-hosting provider. This helps us get your alias emails and repositories names.</p>

						{Object.values(providers).map((provider) => (
							<Button variant="outlined" onClick={() => signIn(provider.id)} key={provider.name} className="mx-auto my-2 max-w-xs w-full py-4 px-4 bg-primary">
								<div className="flex">
								<Image src={getProviderLogoSrc(provider.id as RepoProvider, theme)} alt={provider.name} width={28} height={28} />
								<span className="grow text-lg">Sign in with {provider.name}</span>
								</div>
							</Button>
						))}

					<div className="mt-10 text-primary-text text-[15px]">
						<p>By signing up you accept Vibinex&apos;s <Link href={'/privacy'}><span className="text-secondary">Privacy Policy</span></Link> and <Link href={'/terms'}><span className="text-secondary">T&C</span></Link>.</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getServerSession(context.req, context.res, authOptions);

	// If the user is already logged in, redirect.
	// Note: Make sure not to redirect to the same page
	// To avoid an infinite loop!
	if (session) {
		return { redirect: { destination: "/u" } };
	}

	const providers = await getProviders();

	return {
		props: { providers: providers ?? [] },
	}
}

export default SignInPage;