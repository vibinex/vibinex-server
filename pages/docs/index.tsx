import React, { useState } from 'react';
import MainAppBar from '../../views/MainAppBar';
import Footer from '../../components/Footer';
import GitHubSetup from './repo-setup/github';
import BitbucketSetup, { getBitbucketAuthURL } from './repo-setup/bitbucket';
import VerifySetup from './verify-setup';
import ExtensionSetup from './extension';
import RepoSetup from './repo-setup';
import * as Accordion from '@radix-ui/react-accordion';
import { BiChevronDown } from 'react-icons/bi';

const Docs = ({ bitbucket_auth_url }: { bitbucket_auth_url: string }) => {
	const docs = [
		{
			heading: "Repository setup",
			content: [
				{ subHeading: "Overview", article: <RepoSetup /> },
				{ subHeading: "GitHub", article: <GitHubSetup /> },
				{ subHeading: "Bitbucket", article: <BitbucketSetup bitbucket_auth_url={bitbucket_auth_url} /> },
			]
		},
		{
			heading: "Chrome extension",
			content: <ExtensionSetup />
		},
		{
			heading: "Verify your setup",
			content: <VerifySetup />
		}
	]

	const [heading, setHeading] = useState('Overview')
	const [article, setArticle] = useState((docs[0].content instanceof Array) ? docs[0].content[0].article : docs[0].content)

	const menu = docs.map((item, index) => {
		return (
			<div key={index}>
				<h1 className={`cursor-pointer sm:mt-6 p-3 rounded-md sm:ml-0 ml-8 text-1xl font-semibold ${(heading === item.heading) ? "text-primary-main" : null}`}
					onClick={() => {
						if (item.content instanceof Array) {
							const subItem = item.content[0];
							setHeading(subItem.subHeading);
							setArticle(subItem.article);
						} else {
							setHeading(item.heading);
							setArticle(item.content)
						}
					}}									>
					{item.heading}
				</h1>

				{(item.content instanceof Array) && item.content.map((subItem, index) => {
					return (
						<h1 key={index} className={`ml-6 text-sm mt-2 border-l-2 border-[gray] pl-2 ${(heading === subItem.subHeading) ? "text-primary-main" : null}`}
							onClick={() => {
								setHeading(subItem.subHeading);
								setArticle(subItem.article);
							}}>
							{subItem.subHeading}
						</h1>
					)
				})}
			</div>
		)
	})

	return (
		<div>
			<MainAppBar />

			{/* Center content */}
			<section className='sm:w-[75%] w-[90%] m-auto sm:mt-10 mb-10 sm:flex p-2'>
				<div className='mr-10 sm:border-r-2 p-4 sm:border-[gray] hidden sm:block'>
					{menu}
				</div>
				<Accordion.Root type='single' defaultValue='repo-setup' collapsible className='z-10 rounded-md w-full bg-primary-light shadow shadow-primary-text sm:hidden'>
					<Accordion.Item value='repo-setup' className='overflow-hidden mt-0 rounded-sm focus-within:relative focus-within:z-20 focus-within:shadow-sm'>
						<Accordion.Header className='flex'>
							<Accordion.Trigger className='bg-transparent px-5 h-11 flex-1 flex items-center justify-between text-primary-darktext shadow-sm bg-primary-light hover:bg-primary-light/80'>
								Menu
								<BiChevronDown aria-hidden />
							</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content className='overflow-hidden data-[state="open"]:animate-openAccordion data-[state="closed"]:animate-closeAccordion'>
							<div>{menu}</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>

				<div>
					{
						(article instanceof Array) ? (<ol>
							{article.map((item, index) => {
								return (
									<li key={index} className='mt-4 font-sans'>
										{item.article}
									</li>
								)
							})}
						</ol>) : article
					}
				</div>
			</section>

			<Footer />
		</div>
	)
}

Docs.getInitialProps = async () => ({
	bitbucket_auth_url: getBitbucketAuthURL()
})

export default Docs