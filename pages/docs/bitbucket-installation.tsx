import React from 'react';
import DocsSideBar from '../../views/docs/DocsSideBar';
import MainAppBar from '../../views/MainAppBar';
import Footer from '../../components/Footer';
import Markdown from 'react-markdown';
import remarkGfm from "remark-gfm";

const BitbucketInstallation: React.FC = () => {
	const installationMD = `
## Sign in to Bitbucket
First, you need to sign in to your Bitbucket account. If you don't have an account, you can create one by visiting https://bitbucket.org/account/signup/.

## Grant Vibinex access to your repositories
After signing in, you need to grant Vibinex access to your repositories. Click on the "Authorize Bitbucket OAuth Consumer" button on the Vibinex website. This will redirect you to Bitbucket's authorization page.

On the authorization page, you will be asked to grant Vibinex access to your repositories. Review the permissions and click "Grant access" to proceed.

## Select repositories
After granting access, you will be redirected back to the Vibinex website. Here, you can select the repositories you want to set up with Vibinex.

You can either select individual repositories or select all repositories in your Bitbucket account. Once you have made your selection, click "Continue" to proceed.

## Configure Vibinex
In this step, you will configure Vibinex for your selected repositories. You can choose between self-hosting or cloud-hosting options.

If you choose self-hosting, you will need to set up a Docker container on your own infrastructure. Detailed instructions for self-hosting will be provided.

If you choose cloud-hosting, Vibinex will handle the hosting for you. You will need to provide some information about your cloud provider and Vibinex will set up the necessary infrastructure.

## Install browser extension
To get the most out of Vibinex, you should install the Vibinex browser extension. This extension will highlight relevant code changes and provide additional information directly in your Bitbucket pull requests.

You can install the extension by visiting https://chromewebstore.google.com/detail/vibinex-code-review/jafgelpkkkopeaefadkdjcmnicgpcncc?pli=1.

## Verify your setup
After completing the installation steps, you can verify that Vibinex is working correctly by checking your Bitbucket repositories.

You should see the Vibinex logo next to the repositories that are set up with Vibinex. When you view pull requests, relevant code changes should be highlighted in yellow.

If you encounter any issues or have questions, please refer to the troubleshooting section or contact our support team.
`

	const RenderMarkdown = (props: { markdownText: string }) => {
		const { markdownText } = props;
		return (<span className='rich-text'>
			{markdownText.split("\n").map((line: string, index: number) => {
				return (
					<Markdown remarkPlugins={[remarkGfm]} key={index}>
						{line}
					</Markdown>
				)
			})}
		</span>)
	}

	return (
		<div>
			<MainAppBar />
			<div className="flex">
				<DocsSideBar className='w-full sm:w-80' />

				{/* Center content */}
				<div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
					<RenderMarkdown markdownText={installationMD} />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default BitbucketInstallation;
