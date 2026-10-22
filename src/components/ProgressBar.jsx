import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'

// Visual replacement for the hidden scrollbar.
export default function ProgressBar() {
  const bar = useRef(null)
  useEffect(() => {
    const tween = gsap.to(bar.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    })
    return () => tween.scrollTrigger?.kill()
  }, [])
  return <div className="progress"><span ref={bar} /></div>
}
