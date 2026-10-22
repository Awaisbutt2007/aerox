import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/scroll'

// Maps scroll progress through `triggerRef` onto the video's currentTime.
// The playhead eases toward the target so scrubbing feels smooth.
export function useScrubVideo(videoRef, triggerRef, { start = 'top top', end = 'bottom bottom', from = 0, to = 1 } = {}) {
  useEffect(() => {
    const video = videoRef.current
    const trigger = triggerRef.current
    if (!video || !trigger) return

    let target = 0
    let current = 0
    let raf

    // iOS only allows seeking after the video has been "played" once.
    const unlock = () => video.play().then(() => video.pause()).catch(() => {})
    window.addEventListener('touchstart', unlock, { once: true })
    video.pause()

    const st = ScrollTrigger.create({
      trigger,
      start,
      end,
      onUpdate: (self) => {
        const p = (self.progress - from) / (to - from)
        target = Math.min(1, Math.max(0, p))
      },
    })

    const tick = () => {
      current += (target - current) * 0.12
      if (video.duration && Math.abs(video.currentTime - current * video.duration) > 0.01) {
        video.currentTime = current * (video.duration - 0.05)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      st.kill()
      cancelAnimationFrame(raf)
      window.removeEventListener('touchstart', unlock)
    }
  }, [videoRef, triggerRef, start, end, from, to])
}
