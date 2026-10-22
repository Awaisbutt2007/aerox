import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.1 })
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.1 })
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e) => {
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY)
      const hot = e.target.closest('a, button, .card3d, input')
      ring.current.classList.toggle('is-hot', !!hot)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  )
}
