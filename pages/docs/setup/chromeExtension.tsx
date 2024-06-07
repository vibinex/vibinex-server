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

const ChromeExtension: React.FC = () => {
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

    const chromeExtensionExplainedMD = `## Chrome Extension Link
Please install the chrome extension using the following link which enables highlights for your pull requests.
Once you install the extension, you will be able to see the extension icon in the top right corner of your browser.
Please click on the extension icon to verify that you are logged in. If you are not logged in, please login using the same credentials you used to login to vibinex.com.
`;

    return (
        <div>
            <MainAppBar />
            {loading ? <LoadingOverlay type='loading' /> : (!session ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null)}
            <div className="flex flex-col sm:flex-row">
                <DocsSideBar className='w-full sm:w-80' />
                <div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
                    <RenderMarkdown markdownText={chromeExtensionExplainedMD} />
                    <div className='flex flex-col items-start'>
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

export default ChromeExtension;
