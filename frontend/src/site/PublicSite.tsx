import { useEffect, useState } from 'react'
import { Seo } from './Seo'
import { AnalyticsTracker } from './AnalyticsTracker'
import { WaveBackground } from '../components/WaveBackground'
import { Sidebar } from '../components/Sidebar'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Services } from '../components/Services'
import { Projects } from '../components/Projects'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'

export function PublicSite() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sb-collapsed') === '1',
  )

  useEffect(() => {
    localStorage.setItem('sb-collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  return (
    <>
      <Seo />
      <AnalyticsTracker />
      <WaveBackground />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className={`content${collapsed ? ' is-collapsed' : ''}`}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
