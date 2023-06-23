import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import React, { useEffect, useState } from 'react';
import RudderContext from '../components/RudderContext';
import { rudderEventMethods, RudderstackClientSideEvents } from '../utils/rudderstack_initialize';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const keywords = [
		"git", "GitHub", "BitBucket", "GitLab",
		"pull requests", "review", "code review", "pull request review", "PR review", "code quality", "quality control",
		"context for PR review", "prioritization among pull requests", "review coverage of pull request",
		"vibinex", "Vibinex", "SonarQube", "DeepSource", "Sonar Cloud", "DeepSource alternative", "SonarQube alternative", "Sonar Cloud alternative",
		"devtool", "developer", "productivity", "software development", "software engineer", "developer productivity", "SDE productivity",
		"Engineering managers", "best tools for EMs", "best tools for tech leads",
		"QA tool", "QA tools for engineering managers", "QA tool for tech leads",
		"Chrome extension", "Chrome extension for PR review", "Slackbot for PR reviews"
	]
	const [rudderMethods, setRudderMethods] = useState<RudderstackClientSideEvents | null>(null);

	useEffect(() => {
		const initializeRudder = async () => {
			const methods = await rudderEventMethods();
			setRudderMethods(methods);
		};

		initializeRudder();
	}, []);
	return (
		<RudderContext.Provider value={{ rudderEventMethods: rudderMethods }}>
			<SessionProvider session={session}>
				<Head>
					<title>Vibinex • Open-source pull request personalization for GitHub, GitLab & Bitbucket</title>
					<meta name="description" content="Helps you maintain high code quality, save time and ship faster by streamlining your code review process." />
					<meta name="keywords" content={keywords.join(", ")} />

					{/* Microsoft Clarity Update */}
					<script
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

				</Head>
				<Component {...pageProps} />
			</SessionProvider>
		</RudderContext.Provider>
	)
}