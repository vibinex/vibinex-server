import Button from "../../components/Button";
export const docsData = [
	{
		heading: "Github",
		flag: true,
		content: [
			{ subHeading: "Sign up with github", article: "Log in/Sign up with Vibinex chrome-extension" },
			{ subHeading: "Downlaod Extension", article: "Install Repo Profiler Github App from Github Marketplace in your org/personal account. Make sure you have the permissions required to install the app." },
			{
				subHeading: "Add to Github",
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
			uses: Alokit-Innovations/repo-profiler@v0`}
							</code>
						</pre>
						<p>The code should be added in a file named &quot;repo-profiler.yml&quot; present on the following path - &quot;.github/workflows/repo-profiler.yml&quot; inside the repository.</p>
					</div>

			},
			{ subHeading: "Start adding repo", article: "After installing Github app and adding Github Action to a repository, you should be able to see the Vibinex icon beside the name of the repository. This means your repository is all set up!" },
			{ subHeading: "Start adding repo", article: "Go to the list of open Pull Requests in your repository. Relevant pull requests will be highlighted in yellow or red." },
		]
	},
	{
		heading: "Bitbucket",
		flag: false,
		content: [
			{ subHeading: "Sign up with github", article: "Log in/Sign up with Vibinex chrome-extension" },
			{ subHeading: "Downlaod Extension", article: "Install Vibinex OAuth Consumer in your personal/organization workspace. Make sure you have the permissions required to install oauth consumer." },
			{ subHeading: "Add to Github", article: "Authorize Bitbucket OAuth Consumer:" },
			{
				subHeading: "Start adding repo",
				article:
					<>
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
			{ subHeading: "Step 6", article: "Add this code in : bitbucket- pipelines.yml" },
			{ subHeading: "Step 7", article: "Go to the list of open Pull Requests in your repository. Relevant pull requests will be highlighted in yellowor red." },
			{ subHeading: "Step 8", article: "Within a pull request, files relevant to you will be highlighted in yellow or red." },
		]
	},

];