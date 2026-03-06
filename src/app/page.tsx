'use client'

import SmoothScroll from '@/components/SmoothScroll'
import AnimatedBackground from '@/components/AnimatedBackground'
import Preloader from '@/components/Preloader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Services from '@/components/Services'
import Stats from '@/components/Stats'
import Portfolio from '@/components/Portfolio'
import Machinery from '@/components/Machinery'
import GoogleReviews from '@/components/GoogleReviews'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function Home() {
  return (
    <SmoothScroll>
      <AnimatedBackground />
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Stats />
        <Portfolio />
        <Machinery />
        <GoogleReviews />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </SmoothScroll>
  )
}
