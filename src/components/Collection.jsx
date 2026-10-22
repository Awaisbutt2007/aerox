import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/scroll'
import { useCart } from '../lib/cart'

const PRODUCTS = [
  { name: 'Pulse Runner', tag: 'Footwear', price: 189, video: 'sneaker-360', img: 'sneaker' },
  { name: 'Matchday Jersey', tag: 'Teamwear', price: 89, video: 'jersey-360', img: 'jersey-front' },
  { name: 'Storm Tech Jacket', tag: 'Outerwear', price: 149, video: 'jacket-360', img: 'jacket' },
  { name: 'Velocity Shorts', tag: 'Running', price: 55, video: 'shorts-360', img: 'shorts' },
  { name: 'Vault Duffel', tag: 'Gear', price: 120, video: 'bag-360', img: 'bag' },
]

// Pinned 3D carousel: the ring turns a full 360° as you scroll; every card
// plays its own 360° product-spin video.
export default function Collection() {
  const section = useRef(null)
  const ring = useRef(null)
  const [active, setActive] = useState(0)
  const { add } = useCart()

  useEffect(() => {
    const step = 360 / PRODUCTS.length
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          // inertia: false — snap to the nearest product instead of predicting
          // ahead from scroll velocity (which skipped products).
          snap: { snapTo: 1 / (PRODUCTS.length - 1), inertia: false, duration: { min: 0.3, max: 0.8 }, delay: 0.15, ease: 'power2.inOut' },
          onUpdate: (self) => setActive(Math.round(self.progress * (PRODUCTS.length - 1))),
        },
      })
        .fromTo(ring.current, { rotateY: 0 }, { rotateY: -360 + step, ease: 'none', duration: 1 }, 0)
        .fromTo('.collection__title', { scale: 1.4, opacity: 0.15 }, { scale: 1, opacity: 1, duration: 0.2 }, 0)
      gsap.from('.card3d', {
        opacity: 0, z: -600, rotateX: 50, stagger: 0.1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: section.current, start: 'top 60%' },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const p = PRODUCTS[active]
  return (
    <section className="collection" id="collection" ref={section}>
      <div className="sticky">
        <h2 className="collection__title display">THE <span className="outline">COLLECTION</span></h2>
        <div className="stage">
          <div className="ring" ref={ring}>
            {PRODUCTS.map((item, i) => (
              <article key={item.name} className={`card3d ${i === active ? 'is-active' : ''}`} style={{ '--i': i, '--n': PRODUCTS.length }}>
                <video src={`/videos/${item.video}.mp4`} poster={`/images/${item.img}.jpg`} muted loop autoPlay playsInline preload="metadata" />
                <span className="card3d__badge">360°</span>
              </article>
            ))}
          </div>
        </div>
        <div className="collection__info" key={p.name}>
          <span className="eyebrow">{p.tag}</span>
          <h3>{p.name}</h3>
          <div className="collection__row">
            <b>${p.price}</b>
            <button className="btn btn--sm" onClick={() => add(p)}>Add to cart</button>
          </div>
        </div>
        <div className="collection__count">
          <b>0{active + 1}</b> / 0{PRODUCTS.length}
        </div>
      </div>
    </section>
  )
}
