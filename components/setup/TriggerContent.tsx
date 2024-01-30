import React from 'react';
import Button from '../Button';

interface TriggerContentProps {
    selectedProvider: string;
    bitbucket_auth_url: string;
    selectedInstallationType: string;
    selectedHosting: string;
}

const TriggerContent: React.FC<TriggerContentProps> = ({ selectedProvider, bitbucket_auth_url, selectedHosting, selectedInstallationType }) => {
    const triggerContent = () => {
        if (selectedProvider === 'github') {
            if (selectedHosting == 'selfhosting' && selectedInstallationType == 'individual'){
                return (
                    <div>You are all set!</div>
                )
            }
            return (
                <>
                    <Button
                        id='github-app-install'
                        variant="contained"
                        href="https://github.com/apps/vibinex-code-review-test-app"
                        target='_blank'
                    >
                        Install Github App
                    </Button>
                    <small className='block ml-4'>Note: You will need the permissions required to install a Github App</small>
                </>
            );
        } else if (selectedProvider === 'bitbucket') {
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
