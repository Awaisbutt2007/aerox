import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis

// Smooth scrolling (Lenis) driving GSAP ScrollTrigger. The native scrollbar is
// hidden in CSS, but wheel, touch, keyboard and anchor scrolling all still work.
export function initSmoothScroll() {
  if (lenis) return lenis
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.4 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 })
}

export { gsap, ScrollTrigger }
