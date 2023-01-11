import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Steps from '../views/Steps'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import { rudderstack_initialize } from "./rudderstack_initialize";

export default function Home() {
	React.useEffect(() => {
		rudderstack_initialize();
	  }, []);
  return (
    <div>
      <Navbar />
      <Hero/>
      <WhyUs />
      <Steps />
      <Footer />  
    </div>
  )
}