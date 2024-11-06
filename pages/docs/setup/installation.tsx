import { Session } from 'next-auth';
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import LoadingOverlay from '../../../components/LoadingOverlay';
import RudderContext from '../../../components/RudderContext';
import { getAuthUserId, getAuthUserName } from '../../../utils/auth';
import { getAndSetAnonymousIdFromLocalStorage } from '../../../utils/rudderstack_initialize';
import { Theme, getPreferredTheme } from '../../../utils/theme';
import MainAppBar from '../../../views/MainAppBar';
import DocsSideBar from '../../../views/docs/DocsSideBar';
import { getURLWithParams } from '../../../utils/url_utils';
import { RenderMarkdown } from '../../../components/RenderMarkdown';
import RadioCard from '../../../components/setup/RadioCard';

const InstallationType = () => {
	const [session, setSession] = useState<Session | null>(null);
	const [theme, setTheme] = useState<Theme>('light');
	const [loading, setLoading] = useState(true);
	const { rudderEventMethods } = React.useContext(RudderContext);
	const [selectedInstallation, setSelectedInstallation] = useState<string | null>(null);
	const router = useRouter();


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
	}, []);

	useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage();
		rudderEventMethods?.track(getAuthUserId(session), "docs page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId); //TODO: discuss the correct event-type and name for all client side events
	}, [rudderEventMethods, session]);

	const handleCardSelect = (value: string) => {
		setSelectedInstallation(value);
	};

	const installations = [
		{ value: 'app', label: 'Team Installation: Enjoy all the features of Vibinex on your repositories. \n\nRequires **Vibinex Github App** to be installed by owner or admin user' },
		{ value: 'pat', label: 'Individual Installation: Try out Vibinex with a limited set of features for individual developers, before pitching it to your team. Can be installed by anyone having read permissions on repositories. \n\nRequires a **Github Personal Access Token**' },
	];

	const currentQueryParams = router.query;

	const hostingOptionsExplainedMD = `## Installation Mode
There are two ways of setting up Vibinex
`;
	
	return (
		<div>
			<MainAppBar />
			{loading ? <LoadingOverlay type='loading' /> : (!session ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null)}
			<div className="flex flex-col sm:flex-row">
				<DocsSideBar className='w-full sm:w-80' />
				<div className='sm:w-2/3 mx-auto mt-8 px-2 py-2 relative'>
					<RenderMarkdown markdownText={hostingOptionsExplainedMD} />
					<div className='flex flex-col items-start pb-16'>
						<div className='space-y-4 my-4'>
							{installations.map((option) => (
								<div key={option.value} className='flex items-center gap-2'>
									<RadioCard
										key={option.value}
										value={option.value}
										label={option.label}
										selected={selectedInstallation === option.value}
										onSelect={handleCardSelect}
								/>
								</div>
							))}
						</div>
						<div className="absolute bottom-0 right-0 mb-2 mr-2">
							<Button
								href={selectedInstallation === 'app'
									? getURLWithParams('/docs/setup/hosting', { srcSuffix: '/docs/setup/installation', installation: 'app', provider: 'github'})
									: getURLWithParams('/docs/setup/repositories', { srcSuffix: '/docs/setup/installation', provider: 'github'})}
								variant="contained"
								className='px-4 py-2 flex-1 sm:flex-grow-0'
								disabled={!selectedInstallation}
							>
								Next &raquo;
							</Button>
					</div>
				</div>
			</div>
		</div>
		<Footer />
	</div>
	);
};

export default InstallationType;