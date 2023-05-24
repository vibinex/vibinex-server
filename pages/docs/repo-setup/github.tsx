import Link from "next/link";

const GitHubSetup = () => {
	return (<>
		<h1 className='text-2xl mb-2 font-bold'>Setting up a GitHub repository</h1>
		<ol className="list-decimal list-inside">
			<li className="list-item mt-4 font-sans">Install <Link href="https://github.com/apps/repoprofiler" target='_blank' className="text-blue-500">Repo Profiler Github App</Link> from Github Marketplace in your org/personal account. Make sure you have the permissions required to install the app.</li>
			<li className="list-item mt-4 font-sans">
				Add this code in a file named &quot;repo-profiler.yml&quot; present on the following path - &quot;.github/workflows/repo-profiler.yml&quot; inside the repository.
				<pre className="bg-gray-100 rounded-md p-3 ml-4 mb-4 font-mono whitespace-pre-wrap">
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
			</li>
		</ol>
	</>)
}

export default GitHubSetup;