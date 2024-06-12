import type { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import LoadingOverlay from '../../components/LoadingOverlay';
import { RenderMarkdown } from '../../components/RenderMarkdown';
import RudderContext from '../../components/RudderContext';
import { getAuthUserId, getAuthUserName } from '../../utils/auth';
import { getAndSetAnonymousIdFromLocalStorage } from '../../utils/rudderstack_initialize';
import { getPreferredTheme, Theme } from '../../utils/theme';
import ProductDemo from '../../views/Demo';
import DocsSideBar from '../../views/docs/DocsSideBar';
import MainAppBar from '../../views/MainAppBar';

const Docs = () => {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState<Session | null>(null);
	const [theme, setTheme] = useState<Theme>('light');
	const { rudderEventMethods } = React.useContext(RudderContext);

	const CHROME_EXTENSION_LINK = "https://chromewebstore.google.com/detail/vibinex-code-review/jafgelpkkkopeaefadkdjcmnicgpcncc";
	const architecturalDiagramLightMode = "https://github.com/Alokit-Innovations/.github/assets/7858932/d5a97883-64ef-498f-b97a-318b6675ac87";
	const architecturalDiagramDarkMode = "https://github.com/Alokit-Innovations/.github/assets/7858932/493b3052-b462-4bb8-a9cd-ffa8e1018960";
	const architecturalDiagram = (theme: Theme) => theme === 'light' ? architecturalDiagramLightMode : architecturalDiagramDarkMode;

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

	const introductionMD = `## What is Vibinex?
Vibinex helps you understand the changes in your codebase.
Vibinex helps you:
- Get your pull request merged quickly
- Understand the changes in a pull request faster and better
- Reduce the average time to first review by 50%
`

	const featuresMD = `### Features
1. **Relevant Reviewers Comment**: Vibinex automatically identifies the relevant reviewers for your pull request and publishes the list of reviewers in the pull request as a comment, establishing it as common knowledge.
2. **Automatic Review Assignment**: Vibinex automatically assigns the relevant team members as reviewers to your pull request.
3. **Highlighted Changes**: Vibinex highlights the file names and the changes in your pull request that you have previously worked on and understand deeply.
4. **Highlighted Pull Requests**: Vibinex highlights the pull requests that have changes relevant to you from the list of pull requests on the repository.

You can choose to turn on/off each feature individually.
There are **Feature Flags** on the [Vibinex settings page](https://vibinex.com/settings) to turn the PR comment or the automatic review assignment on or off.
The highlighting features are delivered through the [Chrome extension](${CHROME_EXTENSION_LINK}), which you can disable if you don't want to see the highlights.
`
	const architectureMD = `### Architecture
The diagram below describes the architecture of Vibinex. It consists of 3 components:
3. [Vibinex DPU](https://github.com/Alokit-Innovations/vibi-dpu): Marked as the "Backend #1" in the below diagram, the DPU (Data Processing Unit) is docker container the processes your code. It has no public endpoints for maximum privacy & security.
2. [Vibinex server](https://github.com/Alokit-Innovations/vibinex-server): Marked as the "Backend #2" in the below diagram, the server is the main backend of Vibinex. It triggers the DPU when a PR is created or changed and acts as the backend for the browser extension.
1. [Vibinex Browser extension](https://github.com/Alokit-Innovations/chrome-extension): It modifies the GitHub/Bitbucket UI to show the highlighted PRs and file changes to help you better navigate and understand the changes in your pull request.

![Vibinex Architecture](${architecturalDiagram(theme)})

#### What is a DPU?
A DPU stands for Data Processing Unit. It is a docker container that processes all the sensitive data, i.e. your codebase. Self-hosting the DPU on your own VMs provides the highest privacy.
`

	const setupMD = `### Setup steps
There are just 2 steps to setting up Vibinex:
1. Setup the DPU 
2. Install the browser extension

You can set up the DPU on your repositories either as an owner of the repository or a member. When you set it up as an owner, webhooks are added on your repository that automatically trigger DPU when a pull request is created or updated. When you set it up as a member, you need to manually trigger the DPU when a pull request when you want to process it.

Follow [this guide](/docs/quickstart) for a quick set up.
	`

	return (
		<div>
			<MainAppBar />
			{(loading) ? <LoadingOverlay type='loading' /> :
				(!session) ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null}
			<div className="flex flex-col sm:flex-row">
				<DocsSideBar className='w-full sm:w-80' />

				<div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
					<RenderMarkdown markdownText={introductionMD} />
					<RenderMarkdown markdownText={featuresMD} />
					<ProductDemo />
					<RenderMarkdown markdownText={architectureMD} />
					{/* <Image src={architecturalDiagram(theme)} alt="Vibinex Setup" width={800} height={800} className="mx-auto my-4 w-full max-w-screen-md" /> */}
					<RenderMarkdown markdownText={setupMD} />
				</div>

			</div>
			<Footer />
		</div>
	)
}

export default Docs
