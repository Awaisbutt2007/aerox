import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useTexture, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '../lib/scroll'

// A curved plane: front bulges toward the camera, the back (rotated 180°)
// bulges away, so together they read as a garment with volume.
function useCurvedPlane(w, h, depth) {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(w, h, 48, 1)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) / (w / 2)
      pos.setZ(i, depth * (1 - x * x))
    }
    g.computeVertexNormals()
    return g
  }, [w, h, depth])
}

function Jersey({ progress }) {
  const group = useRef()
  const [front, back] = useTexture(['/images/jersey-front.jpg', '/images/jersey-back.jpg'])
  front.colorSpace = back.colorSpace = THREE.SRGBColorSpace
  const geo = useCurvedPlane(3, 4, 0.35)

  useFrame((state) => {
    const p = progress.current
    const g = group.current
    // One full 360° turn across the pinned section, plus mouse tilt.
    const targetY = p * Math.PI * 2 + state.pointer.x * 0.25
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.08)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.15, 0.08)
    const s = 0.85 + Math.sin(p * Math.PI) * 0.2
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, s, 0.08))
  })

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={group}>
        <mesh geometry={geo}>
          <meshBasicMaterial map={front} toneMapped={false} />
        </mesh>
        <mesh geometry={geo} rotation={[0, Math.PI, 0]}>
          <meshBasicMaterial map={back} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

const FEATURES = [
  { side: 'left', title: 'AeroMesh™', text: 'Laser-cut ventilation zones dump heat 2× faster.' },
  { side: 'right', title: 'FlexSeam', text: 'Bonded seams move with you — zero chafe at sprint pace.' },
  { side: 'left', title: 'DryCore', text: 'Wicks sweat in 0.8s and dries before half-time.' },
  { side: 'right', title: 'Lumen Trim', text: 'Reflective lime panels for night-match visibility.' },
]

export default function Kit3D() {
  const section = useRef(null)
  const progress = useRef(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => (progress.current = self.progress),
        },
      })
      tl.to('.kit__bgword', { xPercent: -40, ease: 'none', duration: 1 }, 0)
        .to('.kit__deg', { innerText: 360, snap: { innerText: 1 }, ease: 'none', duration: 1 }, 0)
      gsap.utils.toArray('.kit__feature').forEach((el, i) => {
        const at = 0.08 + i * 0.22
        tl.fromTo(el, { opacity: 0, y: 60, rotateY: el.dataset.side === 'left' ? 40 : -40 },
          { opacity: 1, y: 0, rotateY: 0, duration: 0.08 }, at)
          .to(el, { opacity: 0, y: -60, duration: 0.06 }, at + 0.16)
      })
      gsap.from('.kit__head > *', {
        y: 80, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: section.current, start: 'top 70%' },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section className="kit" id="kit" ref={section}>
      <div className="sticky">
        <div className="kit__bgword">MATCHDAY · PRO KIT · MATCHDAY · PRO KIT</div>
        <div className="kit__head">
          <p className="eyebrow">Scroll to rotate</p>
          <h2 className="display">THE <span className="kit__deg">0</span>° KIT</h2>
        </div>
        <Canvas className="kit__canvas" camera={{ position: [0, 0, 6.2], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Jersey progress={progress} />
            <Sparkles count={80} scale={[8, 6, 4]} size={2.5} speed={0.4} color="#c6ff3d" />
          </Suspense>
        </Canvas>
        {FEATURES.map((f) => (
          <div key={f.title} className={`kit__feature kit__feature--${f.side}`} data-side={f.side}>
            <span className="kit__line" />
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
