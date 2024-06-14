"use client";

import React from 'react';

import { RenderMarkdown } from "../RenderMarkdown";
import CodeWithCopyButton from './CodeWithCopyButton';
import InstructionsToGeneratePersonalAccessToken from './InstructionsToGeneratePersonalAccessToken';

interface DockerInstructionsProps {
	selectedProvider: string;
	selectedInstallationType: string | null;
	installId: string;
}

const DockerInstructions: React.FC<DockerInstructionsProps> = ({ selectedInstallationType, selectedProvider, installId }) => {
	const selfHostingCode = `
docker run \\\\\\
-v ~/.config/vibinex:/app/config \\\\\\
-e INSTALL_ID=${installId} \\\\\\
${selectedProvider === 'github' && selectedInstallationType === 'pat' ? `-e PROVIDER=github \\\\
-e GITHUB_PAT=<Your gh cli token> \\\\\\
` : ''}asia.gcr.io/vibi-prod/dpu/dpu
  `;

	const instructions = [
		{
			markdown: `1. **Pull the Vibinex DPU image**`,
			command: `docker pull asia.gcr.io/vibi-prod/dpu/dpu`,
		},
		{
			markdown: `2. **Create a config directory. This helps us restart the image from previous state in case of any issues**`,
			command: `mkdir -p ~/.config/vibinex`,
		},
		{
			markdown: `3. **Run the image with the options given below. These are unique to you. Refresh the DPU Status in the side bar to check if dpu started**`,
			command: selfHostingCode,
		}
	];


	return (
		<div className='p-4 relative'>
			{selectedInstallationType === 'individual' && (
				<InstructionsToGeneratePersonalAccessToken selectedInstallationType={selectedInstallationType} selectedProvider={selectedProvider} />
			)}
			{instructions.map((instruction, index) => (
				<div key={`instruction-${index}`}>
					<RenderMarkdown markdownText={instruction.markdown} />
					<CodeWithCopyButton text={instruction.command} />
				</div>
			))}
			<div className="text-xs p-4 border-l-4 border-gray-500">
				<p><strong>Note:</strong> Minimum config required for running docker image:</p>
				<ul className="p-2 rounded">
					<li>RAM: 2 GB</li>
					<li>CPU: 2v or 4v CPU</li>
					<li>Storage: Depends on codebase size, maximum supported - 20 GB</li>
				</ul>
			</div>
		</div>
	);
}

export default DockerInstructions;
