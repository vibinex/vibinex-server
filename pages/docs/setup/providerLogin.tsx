import { Session } from "next-auth";
import { useEffect, useState } from "react"
import { Theme, getPreferredTheme } from "../../../utils/theme";
import React from "react";
import { getAndSetAnonymousIdFromLocalStorage, rudderEventMethods } from "../../../utils/rudderstack_initialize";
import { getAuthUserId, getAuthUserName, isAuthInfoExpired } from "../../../utils/auth";
import RudderContext from "../../../components/RudderContext";
import MainAppBar from "../../../views/MainAppBar";
import LoadingOverlay from "../../../components/LoadingOverlay";
import DocsSideBar from "../../../views/docs/DocsSideBar";
import { RenderMarkdown } from "../../../components/RenderMarkdown";
import Footer from "../../../components/Footer";
import Chip from "../../../components/Chip";
import Button from "../../../components/Button";
import { getURLWithParams } from "../../../utils/url_utils";

const ProviderLogin = () => {
	const [session, setSession] = useState<Session | null>(null);
	const [theme, setTheme] = useState<Theme>('light');
	const [loading, setLoading] = useState(true);
	const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
	const { rudderEventMethods } = React.useContext(RudderContext);

	useEffect(() => {
		setTheme(getPreferredTheme());
		fetch("/api/auth/session", { cache: "no-store" }).then(async (res) => {
			const sessionVal: Session | null = await res.json();
			setSession(sessionVal);
		}).catch((err) => {
			console.error(`[docs] Error in getting session`, err);
		}).finally(() => {
			setLoading(false);
		});
	}, [])

	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		rudderEventMethods?.track(getAuthUserId(session), "docs page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId)
	}, [rudderEventMethods, session]);

	const handleChipClick = (name: string) => {
		setSelectedProvider(name);
		console.log(`Selected chip: ${name}`);
	};

	const loginExplanationMD = `## Code Provider Login
Selecting the right login lets Vibinex set up the correct set of repositories for you.
Please ensure that you are logged in using an account that has at least read permissions for the desired repositories.
Proceed by choosing one of the options below or adding another login.
`;

	return (
		<div>
			<MainAppBar />
			{(loading) ? <LoadingOverlay type='loading' /> :
				(!session) ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null}
			<div className="flex flex-col sm:flex-row">
				<DocsSideBar className='w-full sm:w-80' />
				<div className='sm:w-2/3 mx-auto mt-8 px-2 py-2 relative'>
					<div className="pb-16">
						<RenderMarkdown markdownText={loginExplanationMD} />
						<Button 
							variant="contained" 
							href={
								getURLWithParams('/auth/signin', 
									{ callbackUrl: "/docs/setup/providerLogin" })} 
							className='px-4 py-2 flex-1 sm:flex-grow-0 mb-4'>
								Add login
						</Button>
						{Object.values(session?.user?.auth_info?.github ?? {}).map((githubAuthInfo) => (
							<Chip
								key={githubAuthInfo.handle}
								name={githubAuthInfo.handle ?? "unknown"}
								avatar={"/github-dark.svg"}
								disabled={isAuthInfoExpired(githubAuthInfo)}
								disabledText='This auth has expired'
								onClick={githubAuthInfo.handle ? () => handleChipClick("github") : undefined}
								selected={selectedProvider === "github"}
							/>
						))}
						{Object.values(session?.user?.auth_info?.bitbucket ?? {}).map((bitbucketAuthInfo) => (
							<Chip
								key={bitbucketAuthInfo.handle}
								name={bitbucketAuthInfo.handle ?? "unknown"}
								avatar={"/bitbucket-dark.svg"}
								disabled={isAuthInfoExpired(bitbucketAuthInfo)}
								disabledText='This auth has expired'
								onClick={bitbucketAuthInfo.handle ? () => handleChipClick("bitbucket") : undefined}
								selected={selectedProvider === "bitbucket"}
							/>
						))}
					</div>
					<div className="absolute bottom-0 right-0 mb-2 mr-2">
						<Button
							href={selectedProvider === "bitbucket"
								? getURLWithParams('/docs/setup/repositories', { provider: selectedProvider, srcSuffix: '/docs/setup/providerLogin' })
								: getURLWithParams('/docs/setup/installation', { provider: selectedProvider, srcSuffix: '/docs/setup/providerLogin' })}
							variant="contained"
							className='px-4 py-2 flex-1 sm:flex-grow-0'
							disabled={selectedProvider === null}
						>
							Next &raquo;
						</Button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default ProviderLogin