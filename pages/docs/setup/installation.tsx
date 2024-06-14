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
import RadioCard from '../../../components/setup/RadioCard';

const InstallationType = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [loading, setLoading] = useState(true);
    const { rudderEventMethods } = React.useContext(RudderContext);
    const [selectedInstallation, setSelectedInstallation] = useState<string | null>(null);
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

    const handleCardSelect = (value: string) => {
        setSelectedInstallation(value);
    };

    const installations = [
        { value: 'app', label: 'Project In case of project, you must have all the required permissions to run the tool on your chosen code provider.' },
        { value: 'pat', label: 'Individual In case of individual installation, you will be able to setup the vibinex tool on your personal repositories where you have all the required permissions to run the tool on your chose code provider.' },
    ];

    const currentQueryParams = router.query;

    const hostingOptionsExplainedMD = `## Installation Options
There are two types of installation options:
Individual and Project.
In case of individual installation, you will be able to setup the vibinex tool on your personal repositories where you have all the required permissions to run the tool on your chose code provider.
In case of project, you must have all the required permissions to run the tool on your chosen code provider.
`;
    
    return (
        <div>
            <MainAppBar />
            {loading ? <LoadingOverlay type='loading' /> : (!session ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null)}
            <div className="flex flex-col sm:flex-row">
                <DocsSideBar className='w-full sm:w-80' />
                <div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
                    <RenderMarkdown markdownText={hostingOptionsExplainedMD} />
                    <div className='flex flex-col items-start'>
                        <div className='space-y-4 my-4'>
                            {installations.map((option) => (
                                <div key={option.value} className='flex items-center gap-2'>
                                    <RadioCard
                                        key={option.value}
                                        value={option.value}
                                        label={option.label}
                                        selected={selectedInstallation === option.value}
                                        onSelect={handleCardSelect}
                                />
                                </div>
                            ))}
                        </div>
                        <Button 
                            variant="contained" 
                            href={getURLWithParams('/docs/setup/hosting', { ...currentQueryParams, installation: selectedInstallation })} 
                            className='px-4 py-2' 
                            disabled={!selectedInstallation}
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

export default InstallationType;