import React from 'react';
import DocsSideBar from '../../views/docs/DocsSideBar';
import MainAppBar from '../../views/MainAppBar';
import Footer from '../../components/Footer';

const GithubInstallation: React.FC = () => {
	return (
		<div>
			<MainAppBar />
			<div className="flex">
				<DocsSideBar className='w-full sm:w-80' />

				{/* Center content */}
				<div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
					{/* Add your documentation content for setting up Vibinex on a GitHub repository here */}
					<h1>Setting up Vibinex on GitHub</h1>
					<p>Follow these steps to set up Vibinex on your GitHub repository:</p>
					{/* Add more content as needed */}
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default GithubInstallation;
