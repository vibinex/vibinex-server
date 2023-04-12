import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import Features from '../views/Features'
import TrustUs from '../views/TrustUs'
import { rudderEventMethods } from "../utils/rudderstack_initialize";
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react'
import LoadingOverlay from '../components/LoadingOverlay'
import Steps from '../views/Steps'
import JoinSlack from '../views/JoinSlack'

export default function Home() {
  const { data: session, status } = useSession();
  const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";

  if (status === "authenticated") {
    window.location.assign("/u");
  } else if (status === "unauthenticated") {
    window.postMessage({
      message: 'refreshSession',
      userId: null,
      userName: null,
      userImage: null
    })
  }

  React.useEffect(() => {
    const localStorageAnonymousId = localStorage.getItem('AnonymousId');
    const anonymousId: string = (localStorageAnonymousId && localStorageAnonymousId != null) ? localStorageAnonymousId : uuidv4();

    rudderEventMethods().then((response) => {
      response?.identify("", "", "", anonymousId);
    });
    localStorage.setItem('AnonymousId', anonymousId);
  }, []);

  return (
    <div>
      <Navbar ctaLink={chromeExtensionLink} />
      <Hero ctaLink={chromeExtensionLink} />
      <WhyUs />
      <Features />
      <Steps />
      <TrustUs />
      <JoinSlack />
      <Footer />
      {(status !== "unauthenticated") ? (
        <LoadingOverlay text={(status === "authenticated") ? "Redirecting..." : undefined} />
      ) : null
      }
    </div>
  )
}