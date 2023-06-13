import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import Features from '../views/Features'
import TrustUs from '../views/TrustUs'
import { rudderEventMethods } from "../utils/rudderstack_initialize";
import { v4 as uuidv4 } from 'uuid';

import JoinSlack from '../views/JoinSlack'

export default function Home() {
  const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";

  React.useEffect(() => {
    const localStorageAnonymousId = localStorage.getItem('AnonymousId');
    const anonymousId: string = (localStorageAnonymousId && localStorageAnonymousId != null) ? localStorageAnonymousId : uuidv4();

    rudderEventMethods().then((response) => {
      response?.identify("", "", "", anonymousId);
    });
	rudderEventMethods().then((response) => {
		response?.track("", "Landing page", {page: "Landing page"}, anonymousId)
	})
    localStorage.setItem('AnonymousId', anonymousId);
  }, []);

  return (
    <div>
      <Navbar ctaLink={chromeExtensionLink} transparent={false} />
      <Hero ctaLink={chromeExtensionLink} />
      <WhyUs />
      <Features />
      <TrustUs />
      <JoinSlack />
      <Footer />
    </div>
  )
}