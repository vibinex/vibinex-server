import { Session } from "next-auth";
import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { RenderMarkdown } from '../../../components/RenderMarkdown';
import RudderContext from '../../../components/RudderContext';
import { getAuthUserId, getAuthUserName } from '../../../utils/auth';
import { getAndSetAnonymousIdFromLocalStorage } from '../../../utils/rudderstack_initialize';
import { Theme, getPreferredTheme } from '../../../utils/theme';
import MainAppBar from '../../../views/MainAppBar';
import DocsSideBar from '../../../views/docs/DocsSideBar';
import { getURLWithParams } from "../../../utils/url_utils";

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

    const chromeExtensionExplainedMD = `## Install Chrome Extension
The chrome extension enables highlights for your pull requests.
- It can be installed and used by all team members contributing to a repository on which Vibinex is set up. They do not need to set up their own DPU
- Once you install the extension, click on the extension icon in the top right corner of your browser to verify that you are logged in. If you are not logged in, login using the same credentials you used to login to vibinex.com.
- Ask all your team mates to set their git name and email in their local dev environment, to track commits consistently.
`;

    return (
        <div>
            <MainAppBar />
            {loading ? <LoadingOverlay type='loading' /> : (!session ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null)}
            <div className="flex flex-col sm:flex-row">
                <DocsSideBar className='w-full sm:w-80' session={session} />
                <div className='sm:w-2/3 mx-auto mt-8 px-2 py-2 gap-2'>
                    <RenderMarkdown markdownText={chromeExtensionExplainedMD} />
                    <div className='flex flex-col items-mid pb-16'>
                        <Button
                            variant="contained"
                            href="https://chromewebstore.google.com/detail/vibinex-code-review/jafgelpkkkopeaefadkdjcmnicgpcncc?pli=1"
                            className='px-4 py-2 mt-4'
                        >
                            Install Vibinex Chrome Extension
                        </Button>
                    </div>
                    <div className="flex mb-8 mr-2">
                        <Button onClick={() => window.history.back()} variant="outlined" className="px-4 py-2 flex-1 sm:flex-grow-0">
                            &laquo; Previous
                        </Button>
                        <span className="flex-grow"></span>
                        <Button
                            href={getURLWithParams('/u', {})}
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

export default ChromeExtension;
