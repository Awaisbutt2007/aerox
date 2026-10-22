import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'

const STATS = [
  { value: 182, suffix: 'g', label: 'Pulse Runner weight' },
  { value: 38, suffix: '%', label: 'More energy return' },
  { value: 120, suffix: '+', label: 'Pro teams kitted' },
  { value: 4.9, suffix: '★', label: 'Average athlete rating', decimals: 1 },
]

const TECH = [
  { img: 'jacket', title: 'StormShell', text: 'Waterproof to 20,000mm, breathes like mesh.' },
  { img: 'sneaker', title: 'GlowFoam', text: 'Energy-returning midsole that lights up your stride.' },
  { img: 'shorts', title: 'FeatherWeave', text: '4-way stretch fabric at half the weight.' },
]

export default function Stats() {
  const section = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.stat__num').forEach((el) => {
        const end = parseFloat(el.dataset.value)
        const decimals = Number(el.dataset.decimals || 0)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end, duration: 2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => (el.textContent = obj.v.toFixed(decimals)),
        })
      })
      gsap.from('.stat', {
        y: 80, opacity: 0, rotateX: -60, stagger: 0.12, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: '.stats__grid', start: 'top 80%' },
      })
      gsap.utils.toArray('.tech').forEach((el, i) => {
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)', y: 120 }, {
          clipPath: 'inset(0% 0% 0% 0%)', y: 0, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: 0.6 },
        })
        gsap.fromTo(el.querySelector('img'), { scale: 1.4, rotate: i % 2 ? 8 : -8 }, {
          scale: 1, rotate: 0, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      gsap.from('.stats__quote .w', {
        opacity: 0.12, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: '.stats__quote', start: 'top 80%', end: 'bottom 50%', scrub: true },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  // 3D tilt on hover
  const tilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(e.currentTarget, { rotateY: x * 18, rotateX: -y * 18, duration: 0.4, ease: 'power2.out' })
  }
  const untilt = (e) => gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })

  const quote = 'Every stitch is tested on the track, in the gym and under the floodlights before it ever reaches you.'

  return (
    <section className="stats" id="stats" ref={section}>
      <p className="stats__quote">
        {quote.split(' ').map((w, i) => <span className="w" key={i}>{w} </span>)}
      </p>

      <div className="stats__grid">
        {STATS.map((s) => (
          <div className="stat" key={s.label} onMouseMove={tilt} onMouseLeave={untilt}>
            <div className="stat__value">
              <span className="stat__num" data-value={s.value} data-decimals={s.decimals}>0</span>
              <span>{s.suffix}</span>
            </div>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="tech__grid">
        {TECH.map((t) => (
          <div className="tech" key={t.title} onMouseMove={tilt} onMouseLeave={untilt}>
            <img src={`/images/${t.img}.jpg`} alt={t.title} loading="lazy" />
            <div className="tech__text">
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
