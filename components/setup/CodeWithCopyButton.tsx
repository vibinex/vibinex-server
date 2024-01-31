import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from "react-icons/md";

interface CodeWithCopyButtonProps {
	userId: string;
	selectedProvider: string;
	selectedInstallationType: string;
}

const CodeWithCopyButton: React.FC<CodeWithCopyButtonProps> = ({ userId, selectedInstallationType, selectedProvider }) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
	const [selfHostingCode, setSelfHostingCode] = useState<string>("Generating topic name, please try refreshing if you keep seeing this...");

	useEffect(() => {
		axios.post('/api/dpu/pubsub', { userId }).then((response) => {
			if (response.data.installId) {
				if (selectedInstallationType === 'individual' && selectedProvider === 'github'){
					setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${response.data.installId} \\
-e PROVIDER=<your_provider_here> \\
-e GITHUB_PAT=<Your github personal access token (fine-grained type)> \\
asia.gcr.io/vibi-prod/dpu/dpu
					`);
				} else if (selectedInstallationType === 'individual' && selectedProvider === 'bitbucket'){
					setSelfHostingCode(`
Coming Soon!
					`)
				} else {
					setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${response.data.installId} asia.gcr.io/vibi-prod/dpu/dpu
					`);
				}
			}
			console.log("[CodeWithCopyButton] topic name ", response.data.installId);
		}).catch((error) => {
			setSelfHostingCode(`Unable to get topic name for user\nPlease refresh this page and try again.`);
			console.error(`[CodeWithCopyButton] Unable to get topic name for user ${userId} - ${error.message}`);
		});
	}, [userId]);

	const handleCopyClick = () => {
		setIsButtonDisabled(true);
	};

	const handleCopy = () => {
		setIsCopied(true);
		setIsButtonDisabled(false);
	};

	return (
		<div style={{ position: 'relative' }}>
			<pre>{selfHostingCode}</pre>
			<CopyToClipboard text={selfHostingCode} onCopy={handleCopy}>
				<button
					style={{
						position: 'absolute',
						top: '0px',
						right: '0px',
						cursor: 'pointer',
						background: 'none',
						border: 'none',
					}}
					onClick={handleCopyClick}
					disabled={isButtonDisabled}
				>
					<MdContentCopy />
				</button>
			</CopyToClipboard>
			{isCopied && <span style={{ position: 'absolute', top: '0', right: '50%', transform: 'translate(50%, -100%)', color: 'green' }}>Copied!</span>}
		</div>
	);
};

export default CodeWithCopyButton;
