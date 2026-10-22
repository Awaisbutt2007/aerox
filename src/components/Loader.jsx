import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/scroll'

const ASSETS = ['/videos/hero.mp4', '/images/jersey-front.jpg', '/images/jersey-back.jpg']

export default function Loader({ onDone }) {
  const ref = useRef(null)
  const [pct, setPct] = useState(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    let loaded = 0
    const counter = { v: 0 }
    const bump = () => {
      loaded += 1
      gsap.to(counter, { v: (loaded / ASSETS.length) * 100, duration: 0.6, onUpdate: () => setPct(Math.round(counter.v)) })
    }
    const finish = () => {
      gsap.to(counter, {
        v: 100,
        duration: 0.5,
        onUpdate: () => setPct(Math.round(counter.v)),
        onComplete: () => {
          const tl = gsap.timeline({ onComplete: () => ref.current && (ref.current.style.display = 'none') })
          tl.to('.loader__inner', { y: -40, opacity: 0, duration: 0.5, ease: 'power3.in' })
            .add(() => doneRef.current(), '-=0.1')
            .to('.loader__panel', { yPercent: -100, duration: 0.9, stagger: 0.08, ease: 'expo.inOut' }, '<')
        },
      })
    }
    const all = ASSETS.map((src) =>
      fetch(src).then((r) => r.blob()).catch(() => null).finally(bump),
    )
    const timeout = new Promise((res) => setTimeout(res, 6000))
    Promise.race([Promise.all(all), timeout]).then(finish)
  }, [])

  return (
    <div className="loader" ref={ref}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div className="loader__panel" key={i} style={{ left: `${i * 20}%` }} />
      ))}
      <div className="loader__inner">
        <div className="loader__logo">AEROX</div>
        <div className="loader__bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
        <div className="loader__pct">{String(pct).padStart(3, '0')}%</div>
      </div>
    </div>
  )
}
