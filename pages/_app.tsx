import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import RudderContext from '../components/RudderContext';
import { Toaster } from '../components/Toast/toaster';
import '../styles/globals.css';
import { rudderEventMethods, RudderstackClientSideEvents } from '../utils/rudderstack_initialize';
import { useTheme } from '../utils/theme';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const keywords = [
		"git", "GitHub", "BitBucket", "GitLab", "Gerrit", "Phabricator", "Phabricator features for GitHub", "Phabricator features for Bitbucket",
		"pull requests", "review", "code review", "pull request review", "PR review", "code quality", "quality control",
		"Reduce review time", "Reduce time to review code", "Reduce time to review pull request",
		"context for PR review", "prioritization among pull requests", "review coverage of pull request", "function call graph for pull requests", "dependency graph for pull requests",
		"vibinex", "Vibinex", "FactoryAI", "BitoAI", "Graphite.Dev", "Graphite.dev alternative", "GitKraken", "GitLens", "GitLens for Browser", "GitLens for Chrome",
		"devtool", "developer", "productivity", "software development", "software engineer", "developer productivity", "SDE productivity",
		"Engineering managers", "best tools for EMs", "best tools for tech leads",
		"Chrome extension", "Chrome extension for PR review", "GitHub App for PR reviews", "GitHub Bot for pull requests"
	]
	const [rudderMethods, setRudderMethods] = useState<RudderstackClientSideEvents | null>(null);

	useEffect(() => {
		const initializeRudder = async () => {
			const methods = await rudderEventMethods();
			setRudderMethods(methods);
		};

		initializeRudder();
	}, []);
	useTheme();
	return (
		<RudderContext.Provider value={{ rudderEventMethods: rudderMethods }}>
			<SessionProvider session={session}>
				<Head>
					<title>Vibinex • Review PRs 10x Faster on GitHub</title>
					<meta name="description" content="Makes it easy to navigate, understand and review code changes in GitHub pull requests by adding context and personalization." />
					<meta name="keywords" content={keywords.join(", ")} />
				</Head>
				{/* Microsoft Clarity Update */}
				<Script
					dangerouslySetInnerHTML={{
						__html: `
					(function(c,l,a,r,i,t,y){
						c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
						t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
						y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
					})(window, document, "clarity", "script", "${process.env.CLARITY_ID}");
					`
					}}
				/>
				<Component {...pageProps} />
				<Toaster />
			</SessionProvider>
		</RudderContext.Provider>
	)
}