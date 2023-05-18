import React, { useState } from 'react';
import Button from "../../components/Button";
import Link from "next/link";
import MainAppBar from '../../views/MainAppBar';

const docs = [
	{
		heading: "Github",
		flag: true,
		content: [
			{ subHeading: "Sign up with github", article: "Sign in using GitHub" },
			{ subHeading: "Install GitHub App", article: <>Install <Link href="https://github.com/apps/repoprofiler" className="text-blue-500">Repo Profiler Github App</Link> from Github Marketplace in your org/personal account. Make sure you have the permissions required to install the app.</> },
			{
				subHeading: "Setup GitHub Action",
				article:
					<div>
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
						<p>The code should be added in a file named &quot;repo-profiler.yml&quot; present on the following path - &quot;.github/workflows/repo-profiler.yml&quot; inside the repository.</p>
					</div>

			},
			{ subHeading: "Verify setup", article: "After installing Github app and adding Github Action to a repository, you should be able to see the Vibinex icon beside the name of the repository. This means your repository is all set up!" },
			{ subHeading: "Start using PR highlights", article: "Go to the list of open Pull Requests in your repository. Relevant pull requests will be highlighted in yellow." },
			{ subHeading: "Start using hunk highlights", article: "Go to the 'Files' tab in a pull request. Files relevant to you will be highlighted in yellow." }
		]
	},
	{
		heading: "Bitbucket",
		flag: false,
		content: [
			{ subHeading: "Sign up with Bitbucket", article: "Sign in using Bitbucket" },
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
				article:
					<div>
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
						<p>	If this is your first pipeline, you may need to enable pipelines in your workspace.</p>
					</div>
			},
			{ subHeading: "Step 6", article: "Add this code in: `bitbucket-pipelines.yml`" },
			{ subHeading: "Step 7", article: "Go to the list of open Pull Requests in your repository. Relevant pull requests will be highlighted in yellow." },
			{ subHeading: "Step 8", article: "Within a pull request, files & code hunks relevant to you will be highlighted in yellow." },
		]
	},

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
					{article.map((item, index) => {
						return (
							<div key={index} className='mt-4 font-sans'>
								{index + 1}.  {item.article}
							</div>
						)
					})}
				</div>

			</section>
		</div>
	)
}

export default Docs