import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Steps from '../views/Steps'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <WhyUs />
      <Steps />
      <Footer />
    </div>
  )
}