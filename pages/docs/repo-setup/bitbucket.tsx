import Button from "../../../components/Button";

export default function BitbucketSetup({ bitbucket_auth_url }: { bitbucket_auth_url: string }) {
	return (<>
		<h1 className='text-2xl mb-2 font-bold'>Setting up a Bitbucket repository</h1>
		<ol className="list-decimal list-inside">
			<li className="list-item mt-4 font-sans">
				<Button
					variant="contained"
					href={bitbucket_auth_url}
					target='_blank'
				>
					Authorize Bitbucket OAuth Consumer
				</Button>
				<small className='block ml-4'>Note: You will need the permissions required to install an OAuth consumer</small>
			</li>
			<li className="list-item mt-4 font-sans">
				For each repository, add this Bitbucket Pipeline code in: `bitbucket-pipelines.yml`:
				<pre className="bg-gray-100 ml-4 p-3 rounded-md font-mono whitespace-pre-wrap" >
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
				<small className='block ml-4'>Note: If this is your first pipeline, you may need to enable pipelines in your workspace.</small>
			</li>
		</ol>
	</>)
}

export const getBitbucketAuthURL = () => {
	const baseUrl = 'https://bitbucket.org/site/oauth2/authorize';
	const redirectUri = 'https://gcscruncsql-k7jns52mtq-el.a.run.app/authorise_bitbucket_consumer';
	const scopes = 'repository';
	const clientId = process.env.BITBUCKET_OAUTH_CLIENT_ID;

	const url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
	return url;
}

BitbucketSetup.getInitialProps = async () => ({
	bitbucket_auth_url: getBitbucketAuthURL()
});

