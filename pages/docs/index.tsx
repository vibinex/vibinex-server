import React, { useState } from 'react';
import Button from "../../components/Button";
import Link from "next/link";
import MainAppBar from '../../views/MainAppBar';

const docs = [
	{
		heading: "Github",
		flag: true,
		content: [
			{ subHeading: "Sign up with github", article: "Sign in on Vibinex using GitHub" },
			{ subHeading: "Install GitHub App", article: <>Install <Link href="https://github.com/apps/repoprofiler" className="text-blue-500">Repo Profiler Github App</Link> from Github Marketplace in your org/personal account. Make sure you have the permissions required to install the app.</> },
			{
				subHeading: "Setup GitHub Action",
				article: <>
					Add this code in a file named &quot;repo-profiler.yml&quot; present on the following path - &quot;.github/workflows/repo-profiler.yml&quot; inside the repository.
					<pre className="bg-gray-100 rounded-md p-3 mb-4 font-mono whitespace-pre-wrap">
						<code>
							{`on:
  repository_dispatch:
    types: repo_profile_execution
jobs:
  profile:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Repository Profiler
        uses: Alokit-Innovations/repo-profiler@main`}
						</code>
					</pre>
				</>

			},
		]
	},
	{
		heading: "Bitbucket",
		flag: false,
		content: [
			{ subHeading: "Sign up with Bitbucket", article: "Sign in on Vibinex using Bitbucket" },
			{ subHeading: "Install OAuth consumer", article: "Install Vibinex OAuth Consumer in your personal/organization workspace. Make sure you have the permissions required to install oauth consumer." },
			{
				subHeading: "Add to Github", article: <>
					<Button
						variant="contained"
						href={'https://www.vibinex.com'}
					>
						Authorize Bitbucket OAuth Consumer
					</Button>
				</>
			},
			{
				subHeading: "Code for setup",
				article: <>
					For each repository, add this Bitbucket Pipeline code in: `bitbucket-pipelines.yml`:
					<pre className="bg-gray-100 p-3 rounded-md font-mono whitespace-pre-wrap" >
						<code>
							{`image: atlassian/default-image:4
pipelines:
  branches
    '**':
    - step:
      name: 'Run devprofiler'
      script:
        - pipe: docker://tapish303/repo-profiler-pipe:latest`}
						</code>
					</pre>
					<p>Note: If this is your first pipeline, you may need to enable pipelines in your workspace.</p>
				</>
			},
		]
	},
]

const verifySetup = [
	"In your organization's repository list, you will see the Vibinex logo in front of the repositories that are correctly set up with Vibinex.",
	"When you view the list of pull requests, the relevant ones will get highlighted in yellow, with details that help you choose where to start",
	"Inside the pull request, where you can see the file changes, you will see the parts that are relevant for you highlighted in yellow."
]

const Docs = () => {
	const [heading, setHeading] = useState('Github')
	const [list, setList] = useState(docs);
	// const [sublist, setSublist] = useState(docs[0].content)
	const [article, setArticle] = useState(docs[0].content);

	return (
		<div>
			<MainAppBar />

			{/* Center content */}
			<section className='sm:w-[75%] w-[90%] m-auto sm:mt-10 mb-10 sm:flex p-2'>
				<div className='mr-10 sm:border-r-2 p-4 sm:border-[gray] sm:block flex'>
					{list.map((item, index) => {
						return (
							<div key={index}>
								<h1 onClick={() => {
									setArticle(item.content);
									setHeading(item.heading);
									let temp = list;
									temp[index].flag = !item.flag;
									setList([...temp]);
								}}
									className={`cursor-pointer sm:mt-6 p-3 rounded-md sm:ml-0 ml-8 text-1xl font-semibold ${(heading === item.heading) ? "text-primary-main" : null}`}>
									{item.heading}
								</h1>

								{/* Can also show subheading in tree structure if needed */}
								{/* {item.flag ? (
									item.content.map((item, index) => {
										return (
											<div>
												<h1 className='ml-6 text-sm mt-2 border-l-2 border-[gray] pl-2'>{item.subHeading}</h1>
											</div>
										)
									})
								) : null} */}
							</div>
						)
					})}
				</div>

				<div>
					<h1 className='text-2xl mb-2 font-bold'>Getting started with {heading}</h1>
					<ol>
						{article.map((item, index) => {
							return (
								<li key={index} className='mt-4 font-sans'>
									{index + 1}.  {item.article}
								</li>
							)
						})}
					</ol>

					<h2 className='text-xl mt-4 mb-2 font-semibold'>Verify your setup</h2>
					Once you have set up your repositories, installed the browser extension and signed in, you can verify if everything is correctly set up.
					<ol>
						{verifySetup.map((checkItem, index) => (<li key={index} className='mt-2 ml-1'>
							{index + 1}. {checkItem}
						</li>))}
					</ol>
				</div>
			</section>
		</div>
	)
}

export default Docs