import  HeroSection  from "@/components/Home/Hero"
import  HowItWorks  from "@/components/Home/HowItWork"
import  PaidAssessment  from "@/components/Home/PaidAssessment"
import  MiniAssessment  from "@/components/Home/MiniAssessment"
import  CallToAction  from "@/components/Home/CallToAction"
import  Footer  from "@/components/Home/Footer"
import FreeResources from "@/components/Home/FreeResources"
import AboutUs from "@/components/Home/AboutUs"
import Articles from "@/components/Home/Articles"


export default function Home() {
  return (
    <main className="min-h-screen">
    <HeroSection />
    <HowItWorks />
    <PaidAssessment />
    <MiniAssessment />
    <FreeResources />
    <AboutUs />
    <Articles />
    <CallToAction />
    <Footer />
  </main>
    

  )
}
