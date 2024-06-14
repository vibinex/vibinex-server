"use client";

import type { Session } from "next-auth";
import React from 'react';

import CodeWithCopyButton from './CodeWithCopyButton';
import InstructionsToGeneratePersonalAccessToken from './InstructionsToGeneratePersonalAccessToken';

interface DockerInstructionsProps {
	selectedProvider: string;
	selectedInstallationType: string | null;
	installId: string;
}

const DockerInstructions: React.FC<DockerInstructionsProps> = ({ selectedInstallationType, selectedProvider, installId }) => {
	let selfHostingCode = `
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
mkdir -p ~/.config/vibinex &&\n
docker run -e INSTALL_ID=${installId} -v ~/.config/vibinex:/app/config asia.gcr.io/vibi-prod/dpu/dpu
	`;
	if (selectedProvider === 'github' && selectedInstallationType === 'pat') {
		selfHostingCode = `
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${installId} \\
-e PROVIDER=<your_provider_here> \\
-e GITHUB_PAT=<Your gh cli token> \\
asia.gcr.io/vibi-prod/dpu/dpu
			`;
	}
	

	return (
		<div className='relative'>
			{selectedInstallationType === 'individual' ?
				<InstructionsToGeneratePersonalAccessToken selectedInstallationType={selectedInstallationType} selectedProvider={selectedProvider} />
				: null
			}
			<CodeWithCopyButton text={selfHostingCode} />
			<p className="text-xs mt-2">Minimum config required for running docker image:</p>
			<ul className="text-xs">
				<li>RAM: 2 GB</li>
				<li>CPU: 2v or 4v CPU</li>
				<li>Storage: Depends on codebase size, maximum supported - 20 GB</li>
			</ul>
		</div>
	);
}

export default DockerInstructions;
