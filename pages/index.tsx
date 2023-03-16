import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import { rudderEventMethods } from "../utils/rudderstack_initialize";
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react'
import LoadingOverlay from '../components/LoadingOverlay'

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    window.location.assign("/u");
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
      <Navbar />
      <Hero />
      <WhyUs />
      <Footer />
      {(status !== "unauthenticated") ? (
        <LoadingOverlay text={(status === "authenticated") ? "Redirecting..." : undefined} />
      ) : null
      }
    </div>
  )
}