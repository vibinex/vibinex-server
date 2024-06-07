import axios from "axios";
import type { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import Chip from "../../components/Chip";
import Footer from "../../components/Footer";
import LoadingOverlay from "../../components/LoadingOverlay";
import RudderContext from "../../components/RudderContext";
import BuildInstruction from "../../components/setup/BuildInstruction";
import HostingSelector from "../../components/setup/HostingSelector";
import InstallationSelector from "../../components/setup/InstallationSelector";
import ProviderSelector from "../../components/setup/ProviderSelector";
import RepoSelection from "../../components/setup/RepoSelection";
import TriggerContent from "../../components/setup/TriggerContent";
import {
  getAuthUserId,
  getAuthUserName,
  hasValidAuthInfo,
  isAuthInfoExpired,
} from "../../utils/auth";
import { RepoProvider } from "../../utils/providerAPI";
import { getAndSetAnonymousIdFromLocalStorage } from "../../utils/rudderstack_initialize";
import { getURLWithParams } from "../../utils/url_utils";
import MainAppBar from "../../views/MainAppBar";
import Button from "../../components/Button";
// @ts-ignore
import Stepper from "react-stepper-horizontal";
import DocsSideBar from "../../views/docs/DocsSideBar";

const verifySetup = [
  "In your organization's repository list, you will see the Vibinex logo in front of the repositories that are correctly set up with Vibinex.",
  "When you view the list of pull requests, the relevant ones will get highlighted in yellow, with details that help you choose where to start",
  "Inside the pull request, where you can see the file changes, you will see the parts that are relevant for you highlighted in yellow.",
];

const Docs = ({
  bitbucket_auth_url,
  image_name,
}: {
  bitbucket_auth_url: string;
  image_name: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [installId, setInstallId] = useState<string | null>(null);
  const [isGetInstallIdLoading, setIsGetInstallIdLoading] = useState(false);
  const { rudderEventMethods } = React.useContext(RudderContext);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (res) => {
        const sessionVal: Session | null = await res.json();
        setSession(sessionVal);
        setIsGetInstallIdLoading(true);
        const userId = await getAuthUserId(sessionVal);
        axios
          .post("/api/dpu/pubsub", { userId })
          .then(async (response) => {
            if (response.data.installId) {
              setInstallId(response.data.installId);
            }
          })
          .catch((error) => {
            console.error(
              `[docs] Unable to get topic name for user ${userId} - ${error.message}`
            );
          })
          .finally(() => {
            setIsGetInstallIdLoading(false);
          });
      })
      .catch((err) => {
        console.error(`[docs] Error in getting session`, err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    const anonymousId = getAndSetAnonymousIdFromLocalStorage();
    rudderEventMethods?.track(
      getAuthUserId(session),
      "docs page",
      { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) },
      anonymousId
    );

    const handleGitHubAppClick = () => {
      rudderEventMethods?.track(
        getAuthUserId(session),
        "Install github app",
        {
          type: "link",
          eventStatusFlag: 1,
          source: "docs",
          name: getAuthUserName(session),
        },
        anonymousId
      );
    };

    const handleAuthoriseBitbucketOauthButton = () => {
      rudderEventMethods?.track(
        getAuthUserId(session),
        "Authorise bitbucket consumer",
        {
          type: "button",
          eventStatusFlag: 1,
          source: "docs",
          name: getAuthUserName(session),
        },
        anonymousId
      );
    };

    const githubAppInstallLink = document.getElementById("github-app-install");
    const authoriseBitbucketOauth = document.getElementById(
      "authorise-bitbucket-oauth-consumer"
    );

    githubAppInstallLink?.addEventListener("click", handleGitHubAppClick);
    authoriseBitbucketOauth?.addEventListener(
      "click",
      handleAuthoriseBitbucketOauthButton
    );
    return () => {
      githubAppInstallLink?.removeEventListener("click", handleGitHubAppClick);
      authoriseBitbucketOauth?.removeEventListener(
        "click",
        handleAuthoriseBitbucketOauthButton
      );
    };
  }, [rudderEventMethods, session]);

  const providerOptions = [
    {
      value: "github" as RepoProvider,
      label: "Github",
      disabled: !hasValidAuthInfo(session, "github"),
    },
    {
      value: "bitbucket" as RepoProvider,
      label: "Bitbucket",
      disabled: !hasValidAuthInfo(session, "bitbucket"),
    },
  ];
  const [selectedProvider, setSelectedProvider] = useState<
    RepoProvider | undefined
  >(undefined);
  const [selectedInstallation, setSelectedInstallation] = useState<string>("");
  const [selectedHosting, setSelectedHosting] = useState<string>("");

  const steps = [
    "Login",
    "Configure",
    "Setup DPU",
    "Setup Triggers",
    "Install Chrome Extension",
    "Verify Setup",
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  const StepComponent1 = () => (
    <div>
      <h1>Login using the target provider</h1>
      <div className="flex items-center gap-2">
        {Object.values(session?.user?.auth_info?.github ?? {}).map(
          (githubAuthInfo) => (
            <Chip
              key={githubAuthInfo.handle}
              name={githubAuthInfo.handle ?? "unknown"}
              avatar={"/github-dark.svg"}
              disabled={isAuthInfoExpired(githubAuthInfo)}
              disabledText="This auth has expired"
            />
          )
        )}
        {Object.values(session?.user?.auth_info?.bitbucket ?? {}).map(
          (bitbucketAuthInfo) => (
            <Chip
              key={bitbucketAuthInfo.handle}
              name={bitbucketAuthInfo.handle ?? "unknown"}
              avatar={"/bitbucket-dark.svg"}
              disabled={isAuthInfoExpired(bitbucketAuthInfo)}
              disabledText="This auth has expired"
            />
          )
        )}
        <Button
          variant="contained"
          href={getURLWithParams("/auth/signin", {
            callbackUrl: "/docs",
          })}
          className="px-4 py-2 w-full mt-8 sm:flex-grow-0"
        >
          Add login
        </Button>
      </div>
    </div>
  );
  const StepComponent2 = () => (
    <div>
      <h1>Configure DPU</h1>
      <div className="flex flex-col gap-2 pl-4">
        <label className="flex justify-between font-semibold text-sm">
          Provider:
          <ProviderSelector
            providerOptions={providerOptions}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
          />
        </label>
        <label className="flex justify-between font-semibold text-sm">
          Installation Type:
          <InstallationSelector
            selectedInstallation={selectedInstallation}
            setSelectedInstallation={setSelectedInstallation}
          />
        </label>
        <label className="font-semibold text-sm w-full flex justify-between">
          Hosting:
          <HostingSelector
            selectedHosting={selectedHosting}
            setSelectedHosting={setSelectedHosting}
          />
        </label>
      </div>
    </div>
  );
  const StepComponent3 = () => (
    <div>
      <h1>Set up DPU</h1>
      <div>
        <BuildInstruction
          selectedHosting={selectedHosting}
          userId={getAuthUserId(session)}
          selectedInstallationType={selectedInstallation}
          selectedProvider={selectedProvider!!}
          session={session}
          installId={installId}
        />
      </div>
    </div>
  );
  const StepComponent4 = () => (
    <div>
      <h1>Set up triggers</h1>
    </div>
  );
  const StepComponent5 = () => (
    <div>
      <h1>Install browser extension</h1>
      <div>
        <a href="https://chromewebstore.google.com/detail/vibinex-code-review/jafgelpkkkopeaefadkdjcmnicgpcncc?pli=1">
          <Button variant={"text"}>Link</Button>
        </a>
      </div>
    </div>
  );
  const StepComponent6 = () => (
    <div>
      <h1>Verify Setup</h1>
      <div>
        Once you have set up your repositories, installed the browser extension
        and signed in, you can verify if everything is correctly set up.
        <ol>
          {verifySetup.map((checkItem, index) => (
            <li
              key={checkItem}
              className="mt-2 ml-1"
              dangerouslySetInnerHTML={{ __html: `${index + 1}. ${checkItem}` }}
            />
          ))}
        </ol>
      </div>
    </div>
  );

  const stepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepComponent1 />;
      case 1:
        return <StepComponent2 />;
      case 2:
        return <StepComponent3 />;
      case 3:
        return <StepComponent4 />;
      case 4:
        return <StepComponent5 />;
      case 5:
        return <StepComponent6 />;
      default:
        return "Unknown step";
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) =>
      prevStep < steps.length - 1 ? prevStep + 1 : prevStep
    );
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  return (
    <div>
      <MainAppBar />
      {loading ? (
        <LoadingOverlay type="loading" />
      ) : !session ? (
        <LoadingOverlay
          type="error"
          text="Could not get session. Please reload"
        />
      ) : null}

      <div className="flex">
        <DocsSideBar className="w-full  sm:w-80" />
        <div className="flex-initial w-full">
          <Stepper
            steps={steps.map((step) => ({ title: step }))}
            activeStep={activeStep}
            completeColor="#018c77"
            activeTitleColor="#fff"
            completeBarColor="#018c77"
            completeTitleColor="#757575"
            defaultColor="#5096FF"
            activeColor="#4b4e54"
          />
          <div className="flex items-center justify-between p-4 relative ">
            <div className="absolute bottom-0 left-0 m-16">
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="text"
                className="bg-blue-500 "
              >
                &laquo; Previous
              </Button>
            </div>
            <div className="flex flex-row min-h-96 justify-center items-center flex-grow mx-32 ">
              {stepContent(activeStep)}
            </div>
            <div className="absolute bottom-0 right-0 m-16">
              <Button
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                variant="contained"
              >
                Next &raquo;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    //  {/* Center content */}
    //  <Accordion type="single" defaultValue="instruction-1" className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
    //
    //
    //    <AccordionItem value="instruction-4" disabled={!selectedProvider}>
    //      {selectedProvider === 'github' && selectedHosting === 'selfhosting' && selectedInstallation === 'individual' ? (
    //        <>
    //          <AccordionTrigger>Repository Selection</AccordionTrigger>
    //          <AccordionContent>
    //            {isGetInstallIdLoading ? (
    //              <>
    //                <div className='inline-block border-4 border-t-secondary rounded-full w-6 h-6 animate-spin mx-2'></div>
    //                Generating topic name...
    //              </>
    //            ) : installId ? (
    //              <RepoSelection repoProvider={selectedProvider as RepoProvider} installId={installId as string} setIsRepoSelectionDone={null} isNewAccordion={true} />
    //            ) : (
    //              <>User Info not found, please refresh and try again.</>
    //            )}
    //          </AccordionContent>
    //        </>
    //      ) : (
    //        <>
    //          <AccordionTrigger>Set up triggers</AccordionTrigger>
    //          <AccordionContent>
    //            <TriggerContent selectedProvider={selectedProvider} bitbucket_auth_url={bitbucket_auth_url} selectedHosting={selectedHosting} selectedInstallationType={selectedInstallation} />
    //          </AccordionContent>
    //        </>
    //      )}
    //    </AccordionItem>
    //  </Accordion>

    //  <Footer />
    // </div>
  );
};

Docs.getInitialProps = async () => {
  const baseUrl = "https://bitbucket.org/site/oauth2/authorize";
  const redirectUri = "https://vibinex.com/api/bitbucket/callbacks/install";
  const scopes = "repository";
  const clientId = process.env.BITBUCKET_OAUTH_CLIENT_ID;
  const image_name = process.env.DPU_IMAGE_NAME;

  const url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
  console.debug(`[getInitialProps] url: `, url);
  return {
    bitbucket_auth_url: url,
    image_name: image_name,
  };
};

export default Docs;
