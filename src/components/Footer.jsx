import { useEffect, useRef, useState } from 'react'
import { gsap, scrollToTarget } from '../lib/scroll'
import { useScrubVideo } from '../hooks/useScrubVideo'

// [label, scroll target] — pages that don't exist yet point to the closest section.
const COLS = [
  ['Shop', [['Footwear', '#collection'], ['Teamwear', '#kit'], ['Outerwear', '#collection'], ['Gear', '#collection']]],
  ['Support', [['Shipping', '#stats'], ['Returns', '#stats'], ['Size guide', '#kit'], ['Contact', '.cta']]],
  ['Brand', [['Athletes', '#showcase'], ['Technology', '#stats'], ['Sustainability', '#stats'], ['Careers', '.cta']]],
]

export default function Footer() {
  const cta = useRef(null)
  const video = useRef(null)
  const footer = useRef(null)
  const [subscribed, setSubscribed] = useState('')

  useScrubVideo(video, cta, { start: 'top bottom', end: 'bottom bottom' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: cta.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
        .from('.cta__title .char > span', { yPercent: 110, rotate: 12, stagger: 0.03, duration: 0.4 }, 0)
        .from('.cta__sub, .cta__form', { y: 60, opacity: 0, stagger: 0.1, duration: 0.3 }, 0.3)
        .to('.cta__video', { scale: 1.15, duration: 1 }, 0)

      gsap.from('.footer__col', {
        y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: footer.current, start: 'top 85%' },
      })
      gsap.from('.footer__word span', {
        yPercent: 100, stagger: 0.06, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.footer__word', start: 'top 95%' },
      })
    })
    return () => ctx.revert()
  }, [])

  const split = (txt) => [...txt].map((ch, i) => (
    <span className="char" key={i}><span>{ch === ' ' ? ' ' : ch}</span></span>
  ))

  const subscribe = (e) => {
    e.preventDefault()
    setSubscribed(e.currentTarget.email.value)
  }

  return (
    <>
      <section className="cta" ref={cta}>
        <div className="sticky">
          <video ref={video} className="cta__video" src="/videos/stadium.mp4" poster="/images/stadium.jpg" muted playsInline preload="auto" />
          <div className="cta__shade" />
          <div className="cta__content">
            <h2 className="cta__title display">
              <span className="line">{split('JOIN THE')}</span>
              <span className="line line--accent">{split('MOVEMENT')}</span>
            </h2>
            <p className="cta__sub">Early drops, athlete-only colourways and 15% off your first order.</p>
            {subscribed ? (
              <p className="cta__form cta__thanks" role="status">✓ You&apos;re in! Check {subscribed} for your 15% code.</p>
            ) : (
              <form className="cta__form" onSubmit={subscribe}>
                <input type="email" name="email" placeholder="your@email.com" aria-label="Email" required />
                <button className="btn" type="submit">Sign up</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="footer" ref={footer}>
        <div className="footer__top">
          <div className="footer__col">
            <a href="#top" className="logo" onClick={(e) => { e.preventDefault(); scrollToTarget(0) }}>AERO<span>X</span></a>
            <p className="muted">Performance sportswear engineered in motion.</p>
          </div>
          {COLS.map(([title, links]) => (
            <div className="footer__col" key={title}>
              <h4>{title}</h4>
              {links.map(([label, target]) => (
                <a key={label} href={target} className="footer__link" onClick={(e) => { e.preventDefault(); scrollToTarget(target) }}>{label}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer__word" aria-hidden="true">
          {[...'AEROX'].map((c, i) => <span key={i}>{c}</span>)}
        </div>
        <div className="footer__bottom">
          <span>© 2026 AEROX Athletics</span>
          <span>Instagram · TikTok · YouTube</span>
          <button className="footer__top-btn" onClick={() => scrollToTarget(0)}>Back to top ↑</button>
        </div>
      </footer>
    </>
  )
}
