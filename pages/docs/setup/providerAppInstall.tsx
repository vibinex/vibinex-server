import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Session } from "next-auth";
import Button from '../../../components/Button';
import MainAppBar from '../../../views/MainAppBar';
import LoadingOverlay from '../../../components/LoadingOverlay';
import DocsSideBar from '../../../views/docs/DocsSideBar';
import Footer from '../../../components/Footer';
import { Theme, getPreferredTheme } from '../../../utils/theme';
import { getAndSetAnonymousIdFromLocalStorage, rudderEventMethods } from '../../../utils/rudderstack_initialize';
import { getAuthUserId, getAuthUserName } from '../../../utils/auth';
import RudderContext from '../../../components/RudderContext';
import { getURLWithParams } from '../../../utils/url_utils';
import TriggerContent from '../../../components/setup/TriggerContent';
import { RepoProvider } from '../../../utils/providerAPI';
import { RenderMarkdown } from '../../../components/RenderMarkdown';

const ProviderAppInstall: React.FC = () => {
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
    }, [rudderEventMethods, session]);

    const currentQueryParams = router.query;
    const bitbucket_auth_url = 'https://bitbucket.org/site/oauth2/authorize';
    const providerOauthAppInstallationExplainedMD = `## Provider Oauth App Installation
There are two types of installation options:
Individual and Project.
In case of individual installation, you will be able to setup the vibinex tool on your personal repositories where you have all the required permissions to run the tool on your chose code provider.
In case of project, you must have all the required permissions to run the tool on your chosen code provider.
`; //TODO: change content 
    

    return (
        <div>
            <MainAppBar />
            {loading ? <LoadingOverlay type='loading' /> : (!session ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null)}
            <div className="flex flex-col sm:flex-row">
                <DocsSideBar className='w-full sm:w-80' />
                <div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
                    <RenderMarkdown markdownText={providerOauthAppInstallationExplainedMD} />
                    <div className='flex flex-col items-start'>
                        <TriggerContent
                            selectedProvider={provider as RepoProvider}
                            bitbucket_auth_url={bitbucket_auth_url}
                            selectedHosting={hosting as string}
                            selectedInstallationType={installation as string}
                        />
                        <Button
                            variant="contained"
                            href={getURLWithParams('/docs/setup/dockerInstructions', {...currentQueryParams, hosting: hosting })}
                            className='px-4 py-2 mt-4'
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProviderAppInstall;
