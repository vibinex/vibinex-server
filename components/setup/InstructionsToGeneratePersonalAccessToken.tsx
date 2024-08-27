import { RenderMarkdown } from "../RenderMarkdown";

interface InstructionsToGeneratePersonalAccessTokenProps {
	selectedInstallationType: string;
	selectedProvider: string;
}

const InstructionsToGeneratePersonalAccessToken: React.FC<InstructionsToGeneratePersonalAccessTokenProps> = ({ selectedInstallationType, selectedProvider }) => {
	const patInstructionMD = `## Generate Github PAT:
Don't know how to get your github PAT? Don't worry! We have you covered
- Install gh cli using the [instructions provided by GitHub](https://github.com/cli/cli/blob/trunk/docs/install_linux.md)
- Complete GitHub authentication: \`gh auth login\`
- Generate token: \`gh auth token\` Check in \` ~/.config \` directory for the token if the command doesn't work.
  `;
	return (
		<>
		<div className="pb-16">
			<RenderMarkdown markdownText={patInstructionMD} />
		</div>
		</>
	);
}

export default InstructionsToGeneratePersonalAccessToken;