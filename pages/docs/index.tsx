import type { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/Accordion";
import Button from "../../components/Button";
import Chip from '../../components/Chip';
import Footer from '../../components/Footer';
import LoadingOverlay from '../../components/LoadingOverlay';
import RudderContext from '../../components/RudderContext';
import BuildInstruction from '../../components/setup/BuildInstruction';
import HostingSelector from '../../components/setup/HostingSelector';
import InstallationSelector from '../../components/setup/InstallationSelector';
import ProviderSelector from '../../components/setup/ProviderSelector';
import TriggerContent from '../../components/setup/TriggerContent';
import { getAuthUserId, getAuthUserName, hasValidAuthInfo, isAuthInfoExpired } from '../../utils/auth';
import { RepoProvider } from '../../utils/providerAPI';
import { getAndSetAnonymousIdFromLocalStorage } from '../../utils/rudderstack_initialize';
import MainAppBar from '../../views/MainAppBar';

const verifySetup = [
	"In your organization's repository list, you will see the Vibinex logo in front of the repositories that are correctly set up with Vibinex.",
	"When you view the list of pull requests, the relevant ones will get highlighted in yellow, with details that help you choose where to start",
	"Inside the pull request, where you can see the file changes, you will see the parts that are relevant for you highlighted in yellow."
]

const Docs = ({ bitbucket_auth_url, image_name }: { bitbucket_auth_url: string, image_name: string }) => {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState<Session | null>(null);
	const { rudderEventMethods } = React.useContext(RudderContext);

	useEffect(() => {
		fetch("/api/auth/session", { cache: "no-store" }).then(async (res) => {
			const sessionVal = await res.json();
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

		const handleGitHubAppClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Install github app", { type: "link", eventStatusFlag: 1, source: "docs", name: getAuthUserName(session) }, anonymousId)
		};

		const handleAuthoriseBitbucketOauthButton = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Authorise bitbucket consumer", { type: "button", eventStatusFlag: 1, source: "docs", name: getAuthUserName(session) }, anonymousId)
		};

		const githubAppInstallLink = document.getElementById('github-app-install');
		const authoriseBitbucketOauth = document.getElementById('authorise-bitbucket-oauth-consumer');

		githubAppInstallLink?.addEventListener('click', handleGitHubAppClick);
		authoriseBitbucketOauth?.addEventListener('click', handleAuthoriseBitbucketOauthButton);
		return () => {
			githubAppInstallLink?.removeEventListener('click', handleGitHubAppClick);
			authoriseBitbucketOauth?.removeEventListener('click', handleAuthoriseBitbucketOauthButton);
		};
	}, [rudderEventMethods, session]);

	const providerOptions = [
		{ value: 'github' as RepoProvider, label: 'Github', disabled: !hasValidAuthInfo(session, 'github') },
		{ value: 'bitbucket' as RepoProvider, label: 'Bitbucket', disabled: !hasValidAuthInfo(session, 'bitbucket') },
	];
	const [selectedProvider, setSelectedProvider] = useState<RepoProvider | undefined>(undefined);
	const [selectedInstallation, setSelectedInstallation] = useState<string>('');
	const [selectedHosting, setSelectedHosting] = useState<string>('');

	return (
		<div>
			<MainAppBar />
			{(loading) ? <LoadingOverlay type='loading' /> :
				(!session) ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null}

			{/* Center content */}
			<Accordion type="single" defaultValue="instruction-1" className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
				<AccordionItem value="instruction-1">
					<AccordionTrigger>Login using the target provider</AccordionTrigger>
					<AccordionContent className="flex items-center gap-2">
						{Object.values(session?.user?.auth_info?.github ?? {}).map((githubAuthInfo) => (
							<Chip key={githubAuthInfo.handle} name={githubAuthInfo.handle ?? "unknown"} avatar={"/github-dark.svg"} disabled={isAuthInfoExpired(githubAuthInfo)} />
						))}
						{Object.values(session?.user?.auth_info?.bitbucket ?? {}).map((bitbucketAuthInfo) => (
							<Chip key={bitbucketAuthInfo.handle} name={bitbucketAuthInfo.handle ?? "unknown"} avatar={"/bitbucket-dark.svg"} disabled={isAuthInfoExpired(bitbucketAuthInfo)} />
						))}
						<Button variant="contained" href="/api/auth/signin" className='px-4 py-2 flex-1 sm:flex-grow-0'>Add login</Button>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="instruction-2">
					<AccordionTrigger>Configure your DPU</AccordionTrigger>
					<AccordionContent className='flex flex-col gap-2 pl-4'>
						<label className='flex justify-between font-semibold text-sm'>Provider:
							<ProviderSelector providerOptions={providerOptions} selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} />
						</label>
						<label className='flex justify-between font-semibold text-sm'>Installation Type:
							<InstallationSelector selectedInstallation={selectedInstallation} setSelectedInstallation={setSelectedInstallation}/>
						</label>
						<label className='font-semibold text-sm w-full flex justify-between'>Hosting:
							<HostingSelector selectedHosting={selectedHosting} setSelectedHosting={setSelectedHosting}/>
						</label>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="instruction-3" disabled={selectedHosting === '' || !selectedProvider || selectedInstallation === ''}>
					<AccordionTrigger>Set up DPU</AccordionTrigger>
					<AccordionContent>
						<BuildInstruction selectedHosting={selectedHosting} userId={getAuthUserId(session)} selectedInstallationType={selectedInstallation} selectedProvider={selectedProvider!!} session={session} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="instruction-4" disabled={!selectedProvider}>
					<AccordionTrigger>Set up triggers</AccordionTrigger>
					<AccordionContent>
						<TriggerContent selectedProvider={selectedProvider} bitbucket_auth_url={bitbucket_auth_url} selectedHosting={selectedHosting} selectedInstallationType={selectedInstallation}/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="instruction-5">
					<AccordionTrigger>Install browser extension</AccordionTrigger>
					<AccordionContent>
						<a href="https://chromewebstore.google.com/detail/vibinex-code-review/jafgelpkkkopeaefadkdjcmnicgpcncc?pli=1">
							<Button variant={'text'}>Link</Button>
						</a>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="verify-setup">
					<AccordionTrigger>Verify your setup</AccordionTrigger>
					<AccordionContent>
						Once you have set up your repositories, installed the browser extension and signed in, you can verify if everything is correctly set up.
						<ol>
							{verifySetup.map((checkItem, index) => (<li key={checkItem} className='mt-2 ml-1' dangerouslySetInnerHTML={{ __html: `${index + 1}. ${checkItem}` }}/>))}
						</ol>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<Footer />
		</div>
	)
}

Docs.getInitialProps = async () => {
	const baseUrl = 'https://bitbucket.org/site/oauth2/authorize';
	const redirectUri = 'https://vibinex.com/api/bitbucket/callbacks/install';
	const scopes = 'repository';
	const clientId = process.env.BITBUCKET_OAUTH_CLIENT_ID;
	const image_name= process.env.DPU_IMAGE_NAME;

	const url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
	console.debug(`[getInitialProps] url: `, url)
	return {
		bitbucket_auth_url: url,
		image_name: image_name
	}
}

export default Docs
