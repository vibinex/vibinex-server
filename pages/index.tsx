import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    window.location.href = "/repo";
  }
  return (
    <div>
      <Navbar />
      <Hero />
      <WhyUs />
      <Footer />
    </div>
  )
}