import { useEffect, useRef } from 'react'
import { gsap, scrollToTarget } from '../lib/scroll'
import { useScrubVideo } from '../hooks/useScrubVideo'
import Particles from './Particles'

const split = (word) => [...word].map((ch, i) => (
  <span className="char" key={i}><span>{ch}</span></span>
))

export default function Hero({ ready }) {
  const section = useRef(null)
  const video = useRef(null)
  const progress = useRef(0)

  useScrubVideo(video, section)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => (progress.current = self.progress),
        },
      })
        .to('.hero__content', { yPercent: -40, opacity: 0, scale: 0.9, filter: 'blur(8px)', duration: 0.3 }, 0)
        .to('.hero__scroll', { opacity: 0, duration: 0.1 }, 0)
        .fromTo('.hero__second', { opacity: 0, y: 120 }, { opacity: 1, y: 0, duration: 0.25 }, 0.35)
        .fromTo('.hero__spec', { opacity: 0, x: -40 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.15 }, 0.45)
        .to('.hero__second', { opacity: 0, y: -100, duration: 0.2 }, 0.8)
        .to('.hero__video', { scale: 1.08, duration: 1 }, 0)
    }, section)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.3 })
        .fromTo('.hero__video',
          { opacity: 0, clipPath: 'inset(40% 30% 40% 30%)' },
          { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' })
        .from('.hero__title .char > span', { yPercent: 120, rotateX: -90, opacity: 0, stagger: 0.04, duration: 1.1, ease: 'expo.out' }, 0.3)
        .from('.hero__eyebrow, .hero__lead, .hero__cta > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' }, 0.8)
        .from('.hero__scroll', { opacity: 0, duration: 0.8 }, 1.2)
    }, section)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero" id="top" ref={section}>
      <div className="sticky">
        <video ref={video} className="hero__video" src="/videos/hero.mp4" poster="/images/hero.jpg" muted playsInline preload="auto" />
        <div className="hero__shade" />
        <Particles className="hero__particles" progress={progress} />

        <div className="hero__content">
          <p className="hero__eyebrow eyebrow">FW26 · Performance Collection</p>
          <h1 className="hero__title">
            <span className="line">{split('DEFY')}</span>
            <span className="line line--outline">{split('GRAVITY')}</span>
          </h1>
          <p className="hero__lead">Sportswear built for athletes who don&apos;t slow down. Lighter. Faster. Engineered in motion.</p>
          <div className="hero__cta">
            <button className="btn" onClick={() => scrollToTarget('#collection')}>Shop Collection</button>
            <button className="btn btn--ghost" onClick={() => scrollToTarget('#kit')}>Explore 360°</button>
          </div>
        </div>

        <div className="hero__second">
          <p className="eyebrow">AEROX Pulse Runner</p>
          <h2 className="display">ENGINEERED<br />FOR <em>SPEED</em></h2>
          <ul>
            <li className="hero__spec"><b>182g</b> featherweight knit</li>
            <li className="hero__spec"><b>+38%</b> energy return foam</li>
            <li className="hero__spec"><b>360°</b> glow-in-motion sole</li>
          </ul>
        </div>

        <div className="hero__scroll"><span>Scroll</span><i /></div>
      </div>
    </section>
  )
}
