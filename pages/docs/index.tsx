import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import Button from "../../components/Button";
import MainAppBar from '../../views/MainAppBar';
import Footer from '../../components/Footer';
import RudderContext from '../../components/RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from '../../utils/rudderstack_initialize';
import { getAuthUserId, getAuthUserName, login } from '../../utils/auth';
import BuildInstruction from '../../components/setup/BuildInsruction';
import TriggerContent from '../../components/setup/TriggerContent';
import ProviderSelector from '../../components/setup/ProviderSelector';
import HostingSelector from '../../components/setup/HostingSelector';
import InstallationSelector from '../../components/setup/InstallationSelector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/Accordion";
import ProviderLogo from '../../components/ProviderLogo';

const verifySetup = [
	"In your organization's repository list, you will see the Vibinex logo in front of the repositories that are correctly set up with Vibinex.",
	"When you view the list of pull requests, the relevant ones will get highlighted in yellow, with details that help you choose where to start",
	"Inside the pull request, where you can see the file changes, you will see the parts that are relevant for you highlighted in yellow."
]

const Docs = ({ bitbucket_auth_url, image_name }: { bitbucket_auth_url: string, image_name: string }) => {
	const [session, setSession] = useState<Session | null>(null);
	const { rudderEventMethods } = React.useContext(RudderContext);

	useEffect(() => {
		fetch("/api/auth/session", { cache: "no-store" }).then(async (res) => {
			const sessionVal = await res.json();
			setSession(sessionVal);
		}).catch((err) => {
			console.error(`[LoginLogout] Error in getting session`, err);
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
		{ value: 'github', label: 'Github', disabled: !session?.user?.auth_info?.github },
		{ value: 'bitbucket', label: 'Bitbucket', disabled: !session?.user?.auth_info?.bitbucket },
	];
	const [selectedProvider, setSelectedProvider] = useState<string>('');
	const [selectedInstallation, setSelectedInstallation] = useState<string>('');
	const [selectedHosting, setSelectedHosting] = useState<string>('');

	return (
		<div>
			<MainAppBar />

			{/* Center content */}
			<Accordion type="single" defaultValue="instruction-1" className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
				<AccordionItem value="instruction-1">
					<AccordionTrigger>Login using the target provider</AccordionTrigger>
					<AccordionContent>
						<div className='flex gap-2'>
							<Button
								variant="contained"
								disabled={!!session?.user?.auth_info?.github} // used double NOT to convert truthy value to 'true'
								href="/api/auth/signin"  // Redirect to sign-in
								className='px-4 py-2'
							>
								<ProviderLogo provider="github" theme="light" className='inline mr-2' />
								Login with GitHub
							</Button>
							<Button
								variant="contained"
								disabled={!!session?.user?.auth_info?.bitbucket} // used double NOT to convert truthy value to 'true'
								href="/api/auth/signin"  // Redirect to sign-in
								className='px-4 py-2'
							>
								<ProviderLogo provider="bitbucket" theme="light" className='inline mr-2' />
								Login with Bitbucket
							</Button>
						</div>
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
				<AccordionItem value="instruction-3" disabled={selectedHosting === ''}>
					<AccordionTrigger>Set up DPU</AccordionTrigger>
					<AccordionContent>
						<BuildInstruction selectedHosting={selectedHosting} userId={getAuthUserId(session)} />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="instruction-4" disabled={selectedProvider === ''}>
					<AccordionTrigger>Set up triggers</AccordionTrigger>
					<AccordionContent>
						<TriggerContent selectedProvider={selectedProvider} bitbucket_auth_url={bitbucket_auth_url}/>
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
