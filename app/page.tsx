import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LogoStrip from "./components/LogoStrip";
import TextMarquee from "./components/TextMarquee";
import Services from "./components/Services";
import About from "./components/About";
import Projects from "./components/Projects";
import Process from "./components/Process";
import VideoShowcase from "./components/VideoShowcase";
import InstagramFeed from "./components/InstagramFeed";
import Blog from "./components/Blog";
import Quotes from "./components/Quotes";
import FAQ from "./components/FAQ";
import Testimonials from "./components/Testimonials";
import AvailableForHire from "./components/AvailableForHire";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoStrip />
        <TextMarquee />
        <Services />
        <About />
        <Projects />
        <Process />
        <VideoShowcase />
        <InstagramFeed />
        <Blog />
        <Quotes />
        <FAQ />
        <Testimonials />
        <AvailableForHire />
      </main>
      <Footer />
    </>
  );
}
