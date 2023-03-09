import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const keywords = [
    "git", "GitHub", "BitBucket", "GitLab",
    "pull requests", "review", "code review", "pull request review", "PR review", "code quality", "quality control",
    "vibinex", "Vibinex", "SonarQube", "DeepSource", "Sonar Cloud", "DeepSource alternative",
    "devtool", "developer", "productivity", "software development", "software engineer", "developer productivity", "SDE productivity",
    "Engineering managers", "best tools for EMs", "best tools for tech leads",
    "QA tool", "QA tools for engineering managers", "QA tool for tech leads",
    "Chrome extension", "Chrome extension   for PR review"
  ]
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Vibinex: Context for code review</title>
        <meta name="description" content="Prioritize & optimize pull request reviews to save time and maximize code-review coverage." />
        <meta name="keywords" content={keywords.join(", ")} />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}