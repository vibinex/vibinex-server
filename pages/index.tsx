import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import { useSession } from "next-auth/react"
import { rudderEventMethods } from "../utils/rudderstack_initialize";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    window.location.href = "/repo";
    localStorage.setItem("name", session.user?.name ? session.user?.name : "User");
    localStorage.setItem("displayPic", session.user?.image ? session.user?.image : "/dummy-profile-pic-female-300n300.jpeg");
  }

  let anonymousId = uuidv4();
  React.useEffect(() => {
    rudderEventMethods().then((response) => {
      response?.identify("", "", "", anonymousId);
    });
    localStorage.setItem('AnonymousId', anonymousId);
  });

  return (
    <div>
      <Navbar />
      <Hero />
      <WhyUs />
      <Footer />
    </div>
  )
}