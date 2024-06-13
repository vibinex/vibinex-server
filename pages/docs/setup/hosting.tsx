import axios from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Footer from "../../../components/Footer";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { RenderMarkdown } from "../../../components/RenderMarkdown";
import RudderContext from "../../../components/RudderContext";
import { useToast } from "../../../components/Toast/use-toast";
import BuildInstruction from "../../../components/setup/BuildInstruction";
import DockerInstructions from "../../../components/setup/DockerInstructions";
import DpuHealthChipWithRefresh from "../../../components/setup/DpuHealthChipWithRefresh";
import InstructionsToGeneratePersonalAccessToken from "../../../components/setup/InstructionsToGeneratePersonalAccessToken";
import { getAuthUserId, getAuthUserName } from "../../../utils/auth";
import { RepoProvider } from "../../../utils/providerAPI";
import { getAndSetAnonymousIdFromLocalStorage } from "../../../utils/rudderstack_initialize";
import { Theme, getPreferredTheme } from "../../../utils/theme";
import { getURLWithParams } from "../../../utils/url_utils";
import MainAppBar from "../../../views/MainAppBar";
import DocsSideBar from "../../../views/docs/DocsSideBar";

const Hosting = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [loading, setLoading] = useState(true);
    const [installId, setInstallId] = useState<string | null>(null);
    const router = useRouter();
    const { provider, installation } = router.query;
    const { rudderEventMethods } = React.useContext(RudderContext);
    const { toast } = useToast();

    useEffect(() => {
        setTheme(getPreferredTheme());
        fetch("/api/auth/session", { cache: "no-store" }).then(async (res) => {
            const sessionVal: Session | null = await res.json();
            setSession(sessionVal);
            setLoading(true);
            const userId = await getAuthUserId(sessionVal);
            axios.post('/api/dpu/pubsub', { userId }).then(async (response) => {
                if (response.data.installId) {
                    setInstallId(response.data.installId);
                }
            }).catch((error) => {
                console.error(`[quickstart] Unable to get topic name for user ${userId} - ${error.message}`);
                toast({
                    description: "Unable to get topic name, please reload the page",
                    variant: "error",
                });

            }).finally(() => {
                setLoading(false);
            });
        }).catch((err) => {
            console.error(`[quickstart] Error in getting session`, err);
        }).finally(() => {
            setLoading(false);
        });
    }, [toast])

    React.useEffect(() => {
        const anonymousId = getAndSetAnonymousIdFromLocalStorage()
        rudderEventMethods?.track(getAuthUserId(session), "docs page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId)
    }, [rudderEventMethods, session]);

    const cloudBuildExplainedMD = `
If you do not wnat to host your own docker and are comfortable in giving us access to your code, please click on the button below.`;

    return (
        <div>
            <MainAppBar />
            {(loading) ? <LoadingOverlay type='loading' /> :
                (!session) ? <LoadingOverlay type='error' text='Could not get session. Please reload' /> : null}
            <div className="flex flex-col sm:flex-row">
                <DocsSideBar className='w-full sm:w-80' />
                <div className='sm:w-2/3 mx-auto mt-8 px-2 py-2 relative'>
                    <DockerInstructions selectedProvider={provider as RepoProvider} selectedInstallationType={installation as string} installId={installId as string} />
                    {installation && installation === 'pat' && provider && provider === 'github' ?
                        <InstructionsToGeneratePersonalAccessToken selectedProvider={provider as RepoProvider} selectedInstallationType={installation as string} />
                        : <> </>}
                    <RenderMarkdown markdownText={cloudBuildExplainedMD} />
                    {installation && installation === 'pat' && provider && provider === 'github' ?
                        <div className='pb-16'>
                            <BuildInstruction selectedProvider={provider as RepoProvider} selectedInstallationType={installation as string} />
                        </div>
                        :
                        <div className='pb-16'> </div>}
                    <div className="absolute bottom-0 right-0 mb-2 mr-2">
                        <Button
                            href={installation === 'pat'
                                ? getURLWithParams('/docs/setup/chromeExtension', { srcSuffix: '/docs/setup/hosting' })
                                : getURLWithParams('/docs/setup/providerAppInstall', { srcSuffix: '/docs/setup/hosting', provider: provider, installation: installation })}
                            variant="contained"
                            className='px-4 py-2 flex-1 sm:flex-grow-0'
                        >
                            Next &raquo;
                        </Button>
                    </div>
                    <div className='absolute bottom-0 left-0 mb-2 ml-2'>
                        <DpuHealthChipWithRefresh userId={getAuthUserId(session)} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Hosting;