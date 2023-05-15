import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

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
  return (
    <SessionProvider session={session}>
      <Head>
        {/* removed the title  */}
        <meta name="description" content="Prioritize & optimize pull request reviews to save time and maximize code-review coverage." />
        <meta name="keywords" content={keywords.join(", ")} />
      </Head>

    </SessionProvider>
  )
}