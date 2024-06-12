
interface InstructionsToGeneratePersonalAccessTokenProps { 
	selectedInstallationType: string;
	selectedProvider: string;
}

const InstructionsToGeneratePersonalAccessToken: React.FC<InstructionsToGeneratePersonalAccessTokenProps> = ({ selectedInstallationType, selectedProvider }) => {
    //TODO: convert all the texts in markdown
    return (
        <>
            <p className="text-xs mt-2">Instructions to generate your gh cli token for Individual GitHub setup:</p>
            <ul className="text-xs">
                <li>Kindly install gh cli using the instructions provided by Github.
                    <br />
                    <a href="https://github.com/cli/cli/blob/trunk/docs/install_linux.md" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}>
                    Link to the Github Docs
                    </a> 
                </li>
                <li style={{ marginTop: '2px' }} >Once you have gh cli setup in your machine, follow the below steps to generate your gh cli token.
                    <br/> 
                    <span className="text-xs mt-2">
                        <ul className="text-xs">
                        <li>Complete github authentication: &nbsp;<code>gh auth login</code></li>
                        <li>Generate token: &nbsp;<code>gh auth token</code></li>
                        </ul>
                    </span>
                </li>
            </ul>
        </>
    );
}

export default InstructionsToGeneratePersonalAccessToken;