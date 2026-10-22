import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, scrollToTarget } from '../lib/scroll'
import { useCart } from '../lib/cart'

const LINKS = [
  ['Kit 360°', '#kit'],
  ['Run & Train', '#showcase'],
  ['Collection', '#collection'],
  ['Tech', '#stats'],
]

export default function Header({ ready }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const { count, setOpen: openCart } = useCart()

  useEffect(() => {
    if (!ready) return
    gsap.fromTo(ref.current.querySelectorAll('.reveal-h'),
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.6 })

    // Hide on scroll down, show on scroll up.
    const st = ScrollTrigger.create({
      start: 'top -120',
      end: 'max',
      onUpdate: (self) => {
        ref.current.classList.toggle('is-hidden', self.direction === 1)
        ref.current.classList.toggle('is-solid', self.scroll() > 120)
      },
      onLeaveBack: () => ref.current.classList.remove('is-hidden', 'is-solid'),
    })
    return () => st.kill()
  }, [ready])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <header className={`header ${open ? 'is-open' : ''}`} ref={ref}>
      <a href="#top" className="logo reveal-h" onClick={(e) => go(e, 0)}>
        AERO<span>X</span>
      </a>
      <nav className="nav">
        {LINKS.map(([label, href]) => (
          <a key={href} href={href} className="nav__link reveal-h" onClick={(e) => go(e, href)}>
            <span data-text={label}>{label}</span>
          </a>
        ))}
      </nav>
      <div className="header__actions reveal-h">
        <button className="btn btn--ghost btn--sm" onClick={() => openCart(true)}>
          Cart <span className="cart-badge bump" key={count}>{count}</span>
        </button>
        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>
          <i /><i />
        </button>
      </div>
    </header>
  )
}
