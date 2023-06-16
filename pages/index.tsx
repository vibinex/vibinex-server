import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import Features from '../views/Features'
import TrustUs from '../views/TrustUs'
import RudderContext from '../components/RudderContext'
import { rudderEventMethods } from "../utils/rudderstack_initialize";
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/url_utils'

import JoinSlack from '../views/JoinSlack'

export default function Home() {
  const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";
  const { rudderEventMethods } = React.useContext(RudderContext);

  React.useEffect(() => {
	const anonymousId = getAndSetAnonymousIdFromLocalStorage()
    rudderEventMethods?.identify("", "", "", anonymousId);
	rudderEventMethods?.track("", "Landing page", {type: "page", page: "Landing page"}, anonymousId)
  }, [rudderEventMethods]);

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