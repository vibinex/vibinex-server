import React, { MouseEvent } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from "react-icons/md";

interface CodeWithCopyButtonProps {
	text: string;
	onCopy: (text: string, result: boolean) => void;
	onClick: (event: MouseEvent) => void;
	disabled: boolean;
	isCopied: boolean;
}

const CodeWithCopyButton: React.FC<CodeWithCopyButtonProps> = ({ text, onCopy, onClick, disabled, isCopied }) => {
	return (
		<div style={{ position: 'relative' }}>
			<pre>{text}</pre>
			<CopyToClipboard text={text} onCopy={onCopy}>
				<button
					style={{
						position: 'absolute',
						top: '0px',
						right: '0px',
						cursor: 'pointer',
						background: 'none',
						border: 'none',
					}}
					onClick={onClick}
					disabled={disabled}
				>
					<MdContentCopy />
				</button>
			</CopyToClipboard>
			{isCopied && <span style={{ position: 'absolute', top: '0', right: '50%', transform: 'translate(50%, -100%)', color: 'green' }}>Copied!</span>}
		</div>
	);
};

export default CodeWithCopyButton;
