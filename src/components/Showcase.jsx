import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { useScrubVideo } from '../hooks/useScrubVideo'

// Pinned horizontal scroll: vertical scroll moves the track sideways and
// scrubs each panel's video while it is on screen.
export default function Showcase() {
  const section = useRef(null)
  const track = useRef(null)
  const runVideo = useRef(null)
  const gymVideo = useRef(null)

  useScrubVideo(runVideo, section, { from: 0, to: 0.6 })
  useScrubVideo(gymVideo, section, { from: 0.4, to: 1 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const distance = () => track.current.scrollWidth - window.innerWidth
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      })
      tl.to(track.current, { x: () => -distance(), ease: 'none', duration: 1 }, 0)
        .fromTo('.panel--run .panel__text', { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 }, 0.1)
        .fromTo('.panel--gym .panel__text', { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 }, 0.65)
        .fromTo('.panel__media', { clipPath: 'inset(12% 8% 12% 8% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', stagger: 0.45, duration: 0.3 }, 0)
      gsap.from('.panel--intro .reveal', {
        y: 100, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: section.current, start: 'top 60%' },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section className="showcase" id="showcase" ref={section}>
      <div className="sticky">
        <div className="showcase__track" ref={track}>
          <div className="panel panel--intro">
            <p className="eyebrow reveal">Built for every rep</p>
            <h2 className="display reveal">RUN.<br /><span className="outline">TRAIN.</span><br />REPEAT.</h2>
            <p className="reveal muted">Keep scrolling — the footage moves with you.</p>
          </div>
          <div className="panel panel--run">
            <div className="panel__media">
              <video ref={runVideo} src="/videos/run.mp4" poster="/images/run.jpg" muted playsInline preload="auto" />
            </div>
            <div className="panel__text">
              <span className="panel__num">01</span>
              <h3>Night Sprint Series</h3>
              <p>Storm-proof shells and reflective trims made for wet tracks and floodlights.</p>
            </div>
          </div>
          <div className="panel panel--gym">
            <div className="panel__media">
              <video ref={gymVideo} src="/videos/gym.mp4" poster="/images/gym.jpg" muted playsInline preload="auto" />
            </div>
            <div className="panel__text">
              <span className="panel__num">02</span>
              <h3>Iron Training Line</h3>
              <p>Compression fits and abrasion-proof panels for the heaviest sessions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
