import Navbar from '@/sections/Navbar';
import Hero from '@/sections/Hero';
import Templates from '@/sections/Templates';
import Tools from '@/sections/Tools';
import Pricing from '@/sections/Pricing';
import HowItWorks from '@/sections/HowItWorks';
import DashboardCTA from '@/sections/Dashboard';
import Testimonials from '@/sections/Testimonials';
import FAQ from '@/sections/FAQ';
import Footer from '@/sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-tajawal">
      <Navbar />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <HowItWorks />
        <section id="tools">
          <Tools />
        </section>
        <section id="templates">
          <Templates />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <DashboardCTA />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
