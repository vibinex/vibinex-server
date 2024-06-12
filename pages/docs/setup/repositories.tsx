import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Theme, getPreferredTheme } from "../../../utils/theme";
import RudderContext from "../../../components/RudderContext";
import React from "react";
import { getAndSetAnonymousIdFromLocalStorage } from "../../../utils/rudderstack_initialize";
import { getAuthUserId, getAuthUserName } from "../../../utils/auth";
import Footer from "../../../components/Footer";
import DocsSideBar from "../../../views/docs/DocsSideBar";
import LoadingOverlay from "../../../components/LoadingOverlay";
import MainAppBar from "../../../views/MainAppBar";
import { useRouter } from "next/router";
import RepoSelection from "../../../components/setup/RepoSelection";
import { RepoProvider, supportedProviders } from "../../../utils/providerAPI";
import Button from "../../../components/Button";
import { getURLWithParams } from "../../../utils/url_utils";

const Repositories = () => {
	const [session, setSession] = useState<Session | null>(null);
	const [theme, setTheme] = useState<Theme>('light');
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { provider, srcSuffix } = router.query;
	const { rudderEventMethods } = React.useContext(RudderContext);
	const [repoProvider, setRepoProvider] = useState<RepoProvider>();

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

	useEffect(() => {
		if (provider) {
			const providerIndex = provider === 'bitbucket' ? 1 : 0;
			console.log(`set provider to ${provider}`)
			setRepoProvider(supportedProviders[providerIndex]);
		}
        console.log(`repoProvider state changed: ${repoProvider}`);
    }, [provider]);

	return (
		<div>
			<MainAppBar />
			{(loading) ? <LoadingOverlay type='loading' /> :
				(!session) ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null}
			<div className="flex flex-col sm:flex-row relative">
				<DocsSideBar className='w-full sm:w-80' />
				<div className="dynamic-div pb-16">
					{repoProvider && <RepoSelection repoProvider={repoProvider as RepoProvider} />}
				</div>
				<div className="absolute bottom-0 right-0 mb-2 mr-2">
					<Button
						href={provider === 'github'
							? getURLWithParams('/docs/setup/hosting', { srcSuffix: '/docs/setup/repositories', installation: 'pat', provider: 'github'})
							: getURLWithParams('/docs/setup/hosting', { srcSuffix: '/docs/setup/repositories', provider: 'bitbucket' })}
						variant="contained"
						className='px-4 py-2 flex-1 sm:flex-grow-0'
					>
						Next &raquo;
					</Button>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Repositories;