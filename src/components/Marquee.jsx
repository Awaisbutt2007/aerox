import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/scroll'

const WORDS = ['RUN FASTER', '✦', 'TRAIN HARDER', '✦', 'RECOVER SMARTER', '✦', 'PLAY BOLDER', '✦']

// Two marquee rows that speed up / reverse with scroll velocity.
export default function Marquee() {
  const ref = useRef(null)

  useEffect(() => {
    const rows = ref.current.querySelectorAll('.marquee__track')
    const tweens = [...rows].map((row, i) =>
      gsap.to(row, { xPercent: i % 2 ? 50 : -50, repeat: -1, duration: 22, ease: 'none' }).totalProgress(i % 2 ? 0.5 : 0),
    )
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300)
        tweens.forEach((t) => {
          gsap.to(t, { timeScale: (self.direction || 1) * (1 + Math.abs(v)), duration: 0.2, overwrite: true })
          gsap.to(t, { timeScale: self.direction || 1, duration: 1.2, delay: 0.2 })
        })
      },
    })
    return () => { st.kill(); tweens.forEach((t) => t.kill()) }
  }, [])

  const row = [...WORDS, ...WORDS, ...WORDS, ...WORDS]
  return (
    <section className="marquee" ref={ref}>
      <div className="marquee__row"><div className="marquee__track">{row.map((w, i) => <span key={i}>{w}</span>)}</div></div>
      <div className="marquee__row marquee__row--alt"><div className="marquee__track">{row.map((w, i) => <span key={i}>{w}</span>)}</div></div>
    </section>
  )
}
