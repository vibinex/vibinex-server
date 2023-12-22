import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import Button from "../../components/Button";
import MainAppBar from '../../views/MainAppBar';
import Footer from '../../components/Footer';
import RudderContext from '../../components/RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from '../../utils/rudderstack_initialize';
import { getAuthUserId, getAuthUserName, login } from '../../utils/auth';
import { MdContentCopy } from "react-icons/md";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/Accordion";
import { Code } from '@radix-ui/themes';
import Select from '../../components/Select';
import axios from 'axios';
import { CloudBuildStatus } from '../../utils/pubsub/pubsubClient';

const verifySetup = [
	"In your organization's repository list, you will see the Vibinex logo in front of the repositories that are correctly set up with Vibinex.",
	"When you view the list of pull requests, the relevant ones will get highlighted in yellow, with details that help you choose where to start",
	"Inside the pull request, where you can see the file changes, you will see the parts that are relevant for you highlighted in yellow."
]

const Docs = ({ bitbucket_auth_url }: { bitbucket_auth_url: string }) => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;
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


	const [selectedProvider, setSelectedProvider] = useState<string>('');
	const providerOptions = [
		{ value: 'github', label: 'Github', disabled: false }, // TODO: @tapishr Replace the disabled flag with the actual status based on auth
		{ value: 'bitbucket', label: 'Bitbucket', disabled: false },
	];

	const [selectedInstallation, setSelectedInstallation] = useState<string>('');
	const installationOptions = [
		{ value: 'individual', label: 'Individual' },
		{ value: 'project', label: 'Project' },
	];

	const [selectedHosting, setSelectedHosting] = useState<string>('');
	const hostingOptions = [
		{ value: 'cloud', label: 'Vibinex Cloud' },
		{ value: 'selfhosting', label: 'Self-hosting' },
	];

	const github_app_url = "https://github.com/apps/vibinex-code-review";
	const triggerContent = () => {
		if (selectedProvider === 'github') {
			return (<>
				<Button
					id='github-app-install'
					variant="contained"
					href={github_app_url}
					target='_blank'
				>
					Install Github App
				</Button>
				<small className='block ml-4'>Note: You will need the permissions required to install a Github App</small>
			</>);
		} else if (selectedProvider === 'bitbucket') {
			return (<>
				<Button
					id='authorise-bitbucket-oauth-consumer'
					variant="contained"
					href={bitbucket_auth_url}
					target='_blank'
				>
					Authorise Bitbucket OAuth Consumer
				</Button>
				<small className='block ml-4'>Note: You will need the permissions required to install an OAuth consumer</small>
			</>);
		} else {
			return <></>;
		}
	};
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
	const [buildStatus, setBuildStatus] = useState<CloudBuildStatus | null>(null);
	const buildInstructionContent = () => {
		const handleBuildButtonClick = async () => {
			setIsButtonDisabled(true);
			setBuildStatus(null);
			const user_id = '6ee91d1a-9ef1-49de-a4ab-281f0bac87f7'; // TODO: replace hard coded user id with the actual user id
			axios.post('/api/dpu/pubsub', {
				user_id: user_id, //getAuthUserId(session),
			}).then((response) => {
				console.log('[handleBuildButtonClick] /api/dpu/pubsub response:', response.data);
				setBuildStatus(response.data);
				if (response.data.success) {
					return;
				}
			}).catch((e) => {
				setBuildStatus({ success: false, message: 'API request failed' });
				console.error('[handleBuildButtonClick] /api/dpu/pubsub request failed:', e.message);
			}).finally(() => {
				setIsButtonDisabled(false);
			});
		}
		const selfhostingCode = "docker pull gcr.io/vibi-prod/dpu\ndocker run gcr.io/vibi-prod/dpu -e INSTALL_ID=insert_install_id"; // TODO - install id	
		if (selectedHosting === 'selfhosting') {
			return (<Code size="2">{selfhostingCode}</Code>);
		} else if (selectedHosting === 'cloud') {
			return (
				<div className="flex items-center gap-4">
					<Button variant="contained" onClick={handleBuildButtonClick} disabled={isButtonDisabled} className='text-lg px-6 py-2'>
						Build
					</Button>
					{buildStatus === null ? (
						isButtonDisabled ? <div className="border-4 border-t-primary-main rounded-full w-6 h-6 animate-spin"></div> : null
					)
						: buildStatus.success ? (<span className='text-success'>Build succeeded!</span>)
							: (<span className='text-error'>Build failed! Error: {buildStatus.message}</span>)
					}
				</div>
			);
		} else {
			return <></>
		}
	}

	return (
		<div>
			<MainAppBar />

			{/* Center content */}
			<Accordion type="single" defaultValue="instruction-1" className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
				<AccordionItem value="instruction-1">
					<AccordionTrigger>Login using the target provider</AccordionTrigger>
				</AccordionItem>
				<AccordionItem value="instruction-2">
					<AccordionTrigger>Configure your DPU</AccordionTrigger>
					<AccordionContent className='flex flex-col gap-2 pl-4'>
						<label className='flex justify-between font-semibold text-sm'>Provider:
							<Select optionsType="Provider" options={providerOptions} onValueChange={setSelectedProvider} defaultValue={selectedProvider} className='w-1/2 font-normal' />
						</label>
						<label className='flex justify-between font-semibold text-sm'>Installation Type:
							<Select optionsType='Installation Type' options={installationOptions} onValueChange={setSelectedInstallation} defaultValue={selectedInstallation} className='w-1/2 font-normal' />
						</label>
						<label className='font-semibold text-sm w-full flex justify-between'>Hosting:
							<Select optionsType='Hosting option' options={hostingOptions} onValueChange={setSelectedHosting} defaultValue={selectedHosting} className='w-1/2 font-normal' />
						</label>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="instruction-3" disabled={selectedHosting === ''}>
					<AccordionTrigger>Set up DPU</AccordionTrigger>
					<AccordionContent>{buildInstructionContent()}</AccordionContent>
				</AccordionItem>
				<AccordionItem value="instruction-4" disabled={selectedProvider === ''}>
					<AccordionTrigger>Set up triggers</AccordionTrigger>
					<AccordionContent>{triggerContent()}</AccordionContent>
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

	const url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
	return {
		bitbucket_auth_url: url
	}
}

export default Docs
