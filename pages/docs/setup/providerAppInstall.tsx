import { Session } from "next-auth";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { RenderMarkdown } from '../../../components/RenderMarkdown';
import RudderContext from '../../../components/RudderContext';
import TriggerContent from '../../../components/setup/TriggerContent';
import { getAuthUserId, getAuthUserName } from '../../../utils/auth';
import { RepoProvider } from '../../../utils/providerAPI';
import { getAndSetAnonymousIdFromLocalStorage } from '../../../utils/rudderstack_initialize';
import { Theme, getPreferredTheme } from '../../../utils/theme';
import { getURLWithParams } from '../../../utils/url_utils';
import MainAppBar from '../../../views/MainAppBar';
import DocsSideBar from '../../../views/docs/DocsSideBar';

const ProviderAppInstall = ({ bitbucket_auth_url }: { bitbucket_auth_url: string }) => {
    const router = useRouter();
    const { provider, installation, ...restQueryParams } = router.query;
    const hosting = "cloud";
    const [session, setSession] = useState<Session | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [loading, setLoading] = useState(true);
    const { rudderEventMethods } = React.useContext(RudderContext);

    useEffect(() => {
        setTheme(getPreferredTheme());
        fetch("/api/auth/session", { cache: "no-store" }).then(async (res) => {
            const sessionVal: Session | null = await res.json();
            setSession(sessionVal);
        }).catch((err) => {
            console.error(`[docs] Error in getting session`, err);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const anonymousId = getAndSetAnonymousIdFromLocalStorage();
        rudderEventMethods?.track(getAuthUserId(session), "docs page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId);
        console.debug(`[useEffect] url: `, bitbucket_auth_url)
    }, [rudderEventMethods, session]);

    const currentQueryParams = router.query;
    const providerOauthAppInstallationExplainedMD = `## Oauth App Installation
Give the docker permissions to clone your repositories, add comments, assign reviewers and add a webhook. Only the docker container gets these permissions.
Refresh the DPU status in the side bar after a few minutes to check if setup succeded
`; //TODO: change content


    return (
        <div>
            <MainAppBar />
            {loading ? <LoadingOverlay type='loading' /> : (!session ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null)}
            <div className="flex flex-col sm:flex-row">
                <DocsSideBar className='w-full sm:w-80' session={session} />
                <div className='sm:w-2/3 mx-auto mt-8 px-2 py-2 relative'>
                    <RenderMarkdown markdownText={providerOauthAppInstallationExplainedMD} />
                    <div className='flex flex-col items-start pb-16'>
                        <TriggerContent
                            selectedProvider={provider as RepoProvider}
                            selectedHosting={hosting as string}
                            selectedInstallationType={installation as string}
                            bitbucket_auth_url={bitbucket_auth_url}
                        />
                    </div>
                    <div className="flex mb-2 mr-2">
                        <Button onClick={() => window.history.back()} variant="outlined" className="px-4 py-2 flex-1 sm:flex-grow-0">
                            &laquo; Previous
                        </Button>
                        <span className="flex-grow"></span>
                        <Button
                            href={getURLWithParams('/docs/setup/chromeExtension', { srcSuffix: '/docs/setup/hosting' })}
                            variant="contained"
                            className='px-4 py-2 flex-1 sm:flex-grow-0'
                        >
                            Next &raquo;
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

ProviderAppInstall.getInitialProps = async () => {
    const baseUrl = 'https://bitbucket.org/site/oauth2/authorize';
    const redirectUri = 'https://vibinex.com/api/bitbucket/callbacks/install';
    const scopes = 'repository';
    const clientId = process.env.BITBUCKET_OAUTH_CLIENT_ID;

    const url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
    console.debug(`[getInitialProps] url: `, url)
    return {
        bitbucket_auth_url: url,
    }
}


export default ProviderAppInstall;
