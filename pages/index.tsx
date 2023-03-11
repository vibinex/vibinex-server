import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import { useSession } from "next-auth/react"
import { rudderEventMethods } from "../utils/rudderstack_initialize";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  let anonymousId = uuidv4();
  React.useEffect(() => {
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
    </div>
  )
}