import  HeroSection  from "@/components/Home/Hero"
import  HowItWorks  from "@/components/Home/HowItWork"
import  Testimonials  from "@/components/Home/Testimonials"
import  Features  from "@/components/Home/Features"
import  CallToAction  from "@/components/Home/CallToAction"
import  Footer  from "@/components/Home/Footer"


export default function Home() {
  return (
    <main className="min-h-screen">
    <HeroSection />
    <HowItWorks />
    <Features />
    <Testimonials />
    <CallToAction />
    <Footer />
  </main>
  )
}
