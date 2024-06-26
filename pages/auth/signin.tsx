"use client";

import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import LoadingOverlay from "../../components/LoadingOverlay";
import { getProviderLogoSrc } from "../../components/ProviderLogo";
import { useToast } from "../../components/Toast/use-toast";
import VibinexDarkLogo from '../../public/vibinex-dark-logo.png';
import VibinexLightLogo from '../../public/vibinex-light-logo.png';
import type { RepoProvider } from "../../utils/providerAPI";
import { getPreferredTheme, type Theme } from "../../utils/theme";

const SignInPage = () => {
	const vibinexLogo = (theme: Theme) => theme === 'dark' ? VibinexDarkLogo : VibinexLightLogo;
	const { toast } = useToast();

	const DEFAULT_CALLBACK_URL = "/u";
	const callbackUrlReceived = typeof window !== "undefined" ? new URL(window.location.href).searchParams.get("callbackUrl") : null;
	const callbackUrl = callbackUrlReceived ?? DEFAULT_CALLBACK_URL;

	const [loading, setLoading] = useState(true);
	const [theme, setTheme] = useState<Theme>('light');
	const [providers, setProviders] = useState<ClientSafeProvider[]>([]);

	useEffect(() => {
		setLoading(true);
		setTheme(getPreferredTheme());

		// get the list of providers
		getProviders()
			.then((receivedProviders) => {
				setProviders(receivedProviders ? Object.values(receivedProviders) : []);
			})
			.catch(err => {
				const errorMessage = "Failed to fetch providers";
				console.error(errorMessage, err);
				toast({
					description: errorMessage,
					variant: "error",
				});
			})
			.finally(() => {
				setLoading(false);
			})
	}, [toast])

	return (
		<div className="h-screen  p-4 pt-10">
			<Head>
				<title>Login to Vibinex</title>
			</Head>
			<div className="sm:mt-20 sm:border-y-2 border-primary-text rounded p-5 sm:w-[50%] m-auto">
				<div className="p-4 text-center flex flex-col">
					<Image src={vibinexLogo(theme)} alt='login page illustration' className="m-auto w-24" />
					<h2 className="font-bold text-[30px] m-5">Sign in to Vibinex</h2>
					{(providers.length === 0) ? (<>
						{loading ? <LoadingOverlay /> : <LoadingOverlay type="error" text="Failed to fetch providers. Please refresh this page." />}
						<div className="block h-56" />
					</>) : providers.map((provider) => (
						<Button variant="outlined" onClick={() => signIn(provider.id, { callbackUrl })} key={provider.name} className="mx-auto my-2 max-w-xs w-full py-4 px-4 bg-primary">
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

export default SignInPage;