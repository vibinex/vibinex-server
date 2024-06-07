import { Session } from 'next-auth';
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import LoadingOverlay from '../../../components/LoadingOverlay';
import RudderContext from '../../../components/RudderContext';
import { getAuthUserId, getAuthUserName } from '../../../utils/auth';
import { getAndSetAnonymousIdFromLocalStorage } from '../../../utils/rudderstack_initialize';
import { Theme, getPreferredTheme } from '../../../utils/theme';
import MainAppBar from '../../../views/MainAppBar';
import DocsSideBar from '../../../views/docs/DocsSideBar';
import { getURLWithParams } from '../../../utils/url_utils';
import { RenderMarkdown } from '../../../components/RenderMarkdown';

interface HostingSelectorProps {
    selectedHosting: string;
    setSelectedHosting: (hosting: string) => void;
}

const HostingSelection: React.FC<HostingSelectorProps> = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [loading, setLoading] = useState(true);
    const { rudderEventMethods } = React.useContext(RudderContext);
    const [selectedHosting, setSelectedHosting] = useState<string | null>(null);
    const router = useRouter();


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
        rudderEventMethods?.track(getAuthUserId(session), "docs page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId); //TODO: discuss the correct event-type and name for all client side events
    }, [rudderEventMethods, session]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedHosting(event.target.value);
        } else {
            setSelectedHosting('');
        }
    };

    const hostingOptions = [
        { value: 'cloud', label: 'Vibinex Cloud' },
        { value: 'selfhosting', label: 'Self-hosting' },
    ];

    const currentQueryParams = router.query;

    const hostingOptionsExplainedMD = `## Hosting Options
Selecting the right login lets Vibinex set up the correct set of repositories for you.
Please ensure that you are logged in using an account that has at least read permissions for the desired repositories.
Proceed by choosing one of the options below or adding another login.
`; //TODO: Change the content
    
    return (
        <div>
            <MainAppBar />
            {loading ? <LoadingOverlay type='loading' /> : (!session ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null)}
            <div className="flex flex-col sm:flex-row">
                <DocsSideBar className='w-full sm:w-80' />
                <div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
                    <RenderMarkdown markdownText={hostingOptionsExplainedMD} />
                    <div className='flex flex-col items-center'>
                        <div className='space-y-4 my-4'>
                            {hostingOptions.map((option) => (
                                <div key={option.value} className='flex items-center gap-2'>
                                    <input
                                        type="checkbox"
                                        id={option.value}
                                        value={option.value}
                                        checked={selectedHosting === option.value}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={option.value}>{option.label}</label>
                                </div>
                            ))}
                        </div>
                        <Button 
                            variant="contained" 
                            href={getURLWithParams('/installtion-type', { ...currentQueryParams, hosting: selectedHosting })} 
                            className='px-4 py-2' 
                            disabled={!selectedHosting}
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

export default HostingSelection;