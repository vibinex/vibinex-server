import React from 'react';
import { RepoProvider } from '../../utils/providerAPI';
import Button from '../Button';

interface TriggerContentProps {
    selectedProvider?: RepoProvider;
    selectedInstallationType: string;
    selectedHosting: string;
}

const TriggerContent: React.FC<TriggerContentProps> = ({ selectedProvider, selectedHosting, selectedInstallationType }) => {
    const baseUrl = 'https://bitbucket.org/site/oauth2/authorize';
	const redirectUri = 'https://vibinex.com/api/bitbucket/callbacks/install';
	const scopes = 'repository';
	const clientId = process.env.BITBUCKET_OAUTH_CLIENT_ID;
	const image_name = process.env.DPU_IMAGE_NAME;

	const bitbucket_auth_url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
	console.debug(`[getInitialProps] url: `, bitbucket_auth_url)

    const triggerContent = () => {
        if (selectedProvider === 'github') {
            if (selectedInstallationType === 'individual'){
                return (
                    <div>You are all set!</div>
                )
            }
            return (
                <>
                    <Button
                        id='github-app-install'
                        variant="contained"
                        href="https://github.com/apps/vibinex-dpu"
                        target='_blank'
                    >
                        Install Github App
                    </Button>
                    <small className='block ml-4'>Note: You will need the permissions required to install a Github App</small>
                </>
            );
        } else if (selectedProvider === 'bitbucket') {
            if (selectedHosting == 'selfhosting' && selectedInstallationType == 'individual'){
                return (
                    <div>Coming Soon!</div>
                )
            }
            return (
                <>
                    <Button
                        id='authorise-bitbucket-oauth-consumer'
                        variant="contained"
                        href={bitbucket_auth_url}
                        target='_blank'
                    >
                        Authorise Bitbucket OAuth Consumer
                    </Button>
                    <small className='block ml-4'>Note: You will need the permissions required to install an OAuth consumer</small>
                </>
            );
        } else {
            return <></>;
        }
    };

    return (
        <div>
            {triggerContent()}
        </div>
    );
};

export default TriggerContent;
