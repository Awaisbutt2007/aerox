import { useEffect, useState } from 'react'
import { initSmoothScroll, ScrollTrigger } from './lib/scroll'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import ProgressBar from './components/ProgressBar'
import Header from './components/Header'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Kit3D from './components/Kit3D'
import Showcase from './components/Showcase'
import Collection from './components/Collection'
import Stats from './components/Stats'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './lib/cart'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const lenis = initSmoothScroll()
    lenis.stop()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!ready) return
    const lenis = initSmoothScroll()
    lenis.start()
    ScrollTrigger.refresh()
  }, [ready])

  return (
    <CartProvider>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <ProgressBar />
      <Header ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Kit3D />
        <Showcase />
        <Collection />
        <Stats />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
