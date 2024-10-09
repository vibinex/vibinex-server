import React from 'react'
import Navbar from '../../../views/Navbar';
import Footer from '../../../components/Footer';
import DocsSideBar from '../../../views/docs/DocsSideBar';
import { RenderMarkdown } from '../../../components/RenderMarkdown';


const VibinexServerSetupSteps = () => {
	const [contributorGuideContent, setContributorGuideContent] = React.useState('');

	React.useEffect(() => {
		fetch('https://raw.githubusercontent.com/vibinex/vibinex-server/refs/heads/main/README.md')
			.then(response => response.text())
			.then(text => setContributorGuideContent(text))
			.catch(error => console.error('Error fetching CONTRIBUTING.md:', error));
	}, []);

	return (
		<>
			<Navbar transparent={false} />
			<div className="flex flex-col sm:flex-row">
				<DocsSideBar className='w-full sm:w-80' />

				<div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
					<RenderMarkdown markdownText={contributorGuideContent} />
				</div>

			</div>
			<Footer />
		</>
	)
}

export default VibinexServerSetupSteps