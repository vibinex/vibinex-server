import React, { useState } from 'react';
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import Button from "../../components/Button";
import Link from "next/link";
import MainAppBar from '../../views/MainAppBar';
import Footer from '../../components/Footer';
import RudderContext from '../../components/RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from '../../utils/rudderstack_initialize';
import { getAuthUserId, getAuthUserName, login } from '../../utils/auth';
import { MdContentCopy } from "react-icons/md";
import * as Accordion from '@radix-ui/react-accordion';
import { Code } from '@radix-ui/themes';
import * as Progress from '@radix-ui/react-progress';


const verifySetup = [
	"In your organization's repository list, you will see the Vibinex logo in front of the repositories that are correctly set up with Vibinex.",
	"When you view the list of pull requests, the relevant ones will get highlighted in yellow, with details that help you choose where to start",
	"Inside the pull request, where you can see the file changes, you will see the parts that are relevant for you highlighted in yellow."
]

interface RadioButtonsProps {
	options: { value: string; label: string }[];
	selectedOption: string;
	onSelect: (value: string) => void;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({ options, selectedOption, onSelect }) => {
	return (
	  <div>
		{options.map((option, index) => (
		  <label key={index}>
			<input
			  type="radio"
			  value={option.value}
			  checked={selectedOption === option.value}
			  onChange={() => onSelect(option.value)}
			/>
			{option.label}
		  </label>
		))}
	  </div>
	);
};

const Docs = ({ bitbucket_auth_url }: { bitbucket_auth_url: string }) => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;
	const [progress, setProgress] = React.useState(43);
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
		setProgress(43); // TODO - set progress using api output
		return () => {
			githubAppInstallLink?.removeEventListener('click', handleGitHubAppClick);
			authoriseBitbucketOauth?.removeEventListener('click', handleAuthoriseBitbucketOauthButton);
		};
	}, [rudderEventMethods, session]);


	const [selectedProvider, setSelectedProvider] = useState<string>('');
	const providerOptions = [
		{ value: 'github', label: 'Github' },
		{ value: 'bitbucket', label: 'Bitbucket' },
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
			return (
			<><Button
				id='github-app-install'
				variant="contained"
				href={github_app_url}
				target='_blank'
			> Install Github App </Button>
			<small className='block ml-4'>Note: You will need the permissions required to install a Github App</small></>);
		} else if (selectedProvider == 'bitbucket') {
			return (
			<><Button
				id='authorise-bitbucket-oauth-consumer'
				variant="contained"
				href={bitbucket_auth_url}
				target='_blank'
			> Authorise Bitbucket OAuth Consumer </Button>
			<small className='block ml-4'>Note: You will need the permissions required to install an OAuth consumer</small></>);
		} else {
			return <></>;
		}
	};

	const selfhostingCode = "docker pull gcr.io/vibi-prod/dpu\ndocker run gcr.io/vibi-prod/dpu -e INSTALL_ID=insert_install_id"; // TODO - install id
	const buildInstructionContent = () => {
		if (selectedHosting === 'selfhosting') {
			return (<Code size="2">{selfhostingCode}</Code>);
		} else if (selectedHosting === 'cloud') {
			return (<><Button variant="contained" target='_blank'>Build</Button>
			<Progress.Root className="ProgressRoot" value={progress}>
				 <Progress.Indicator 
				 className="ProgressIndicator"
				 style={{ transform: `translateX(-${100 - progress}%)` }}
				 />
			</Progress.Root></>);
		} else {
			return <></>
		}
	}

	return (
		<div>
			<MainAppBar />

			{/* Center content */}
			<Accordion.Root type="single" defaultValue="instruction-1">
				<Accordion.Item value="instruction-1">
					<Accordion.AccordionTrigger>Login using the target provider</Accordion.AccordionTrigger>
				</Accordion.Item>
				<Accordion.Item value="instruction-2">
					<Accordion.AccordionTrigger>Configure your DPU</Accordion.AccordionTrigger>
					<Accordion.AccordionContent>
						Provider: <RadioButtons options={providerOptions} selectedOption={selectedProvider} onSelect={setSelectedProvider} />
						Installation Type: <RadioButtons options={installationOptions} selectedOption={selectedInstallation} onSelect={setSelectedInstallation} />
						Hosting: <RadioButtons options={hostingOptions} selectedOption={selectedHosting} onSelect={setSelectedHosting} />
					</Accordion.AccordionContent>
				</Accordion.Item>
				<Accordion.Item value="instruction-3">
					<Accordion.AccordionTrigger>Set up DPU</Accordion.AccordionTrigger>
					<Accordion.AccordionContent>{buildInstructionContent()}</Accordion.AccordionContent>
				</Accordion.Item>
				<Accordion.Item value="instruction-4">
					<Accordion.AccordionTrigger>Set up triggers</Accordion.AccordionTrigger>
					<Accordion.AccordionContent>{triggerContent()}</Accordion.AccordionContent>
				</Accordion.Item>
				<Accordion.Item value="instruction-5">
					<Accordion.AccordionTrigger>Install browser extension</Accordion.AccordionTrigger>
					<Accordion.AccordionContent>
						<a href="https://chromewebstore.google.com/detail/vibinex-code-review/jafgelpkkkopeaefadkdjcmnicgpcncc?pli=1">
							<Button variant={'text'}>Link</Button>
						</a>
					</Accordion.AccordionContent>
				</Accordion.Item>
			</Accordion.Root>

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
