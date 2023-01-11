import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Steps from '../views/Steps'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import { rudderstack_initialize } from "./rudderstack_initialize";
import { v4 as uuidv4} from 'uuid';

export default function Home() {

	let anonymousId = uuidv4();
	React.useEffect(() => {
		const handleEvents = async () => {
			const rudderstackClient = await rudderstack_initialize()
		};
		localStorage.setItem('AnonymousId', anonymousId);
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