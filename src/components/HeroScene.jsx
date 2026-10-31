import { Component, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Edges, Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// Irregular faceted crystal geometry builder
function createIrregularCrystalGeometry() {
  const geom = new THREE.BufferGeometry()
  const angles = [0, 52, 105, 158, 212, 265, 318].map((d) => (d * Math.PI) / 180)
  const n = angles.length

  const topApex = [0.08, 2.35, 0.04]
  const botApex = [-0.06, -2.15, -0.04]

  const upperRing = []
  const lowerRing = []

  angles.forEach((a, i) => {
    const r1 = 1.05 + Math.sin(i * 1.7) * 0.22
    const r2 = 0.95 + Math.cos(i * 2.1) * 0.18
    const y1 = 0.65 + Math.sin(i * 2.3) * 0.25
    const y2 = -0.55 + Math.cos(i * 1.9) * 0.2

    upperRing.push([Math.cos(a) * r1, y1, Math.sin(a) * r1])
    lowerRing.push([Math.cos(a) * r2, y2, Math.sin(a) * r2])
  })

  const vertices = []

  // Top cap facets
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n
    vertices.push(...topApex, ...upperRing[i], ...upperRing[next])
  }

  // Mid prism facets
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n
    vertices.push(...upperRing[i], ...lowerRing[i], ...upperRing[next])
    vertices.push(...upperRing[next], ...lowerRing[i], ...lowerRing[next])
  }

  // Bottom cap facets
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n
    vertices.push(...botApex, ...lowerRing[next], ...lowerRing[i])
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geom.computeVertexNormals()
  return geom
}

// Single floating crystal fragment
function CrystalFragment({ position, scale, rotationSpeed = 0.2, reducedMotion }) {
  const meshRef = useRef(null)

  useFrame(({ clock }) => {
    if (reducedMotion || !meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = t * rotationSpeed * 0.8
    meshRef.current.rotation.y = t * rotationSpeed
    meshRef.current.rotation.z = Math.sin(t * 0.5 * rotationSpeed) * 0.3
  })

  return (
    <Float
      speed={reducedMotion ? 0 : 1.3}
      rotationIntensity={reducedMotion ? 0 : 0.2}
      floatIntensity={reducedMotion ? 0 : 0.6}
    >
      <group position={position} scale={scale}>
        <mesh ref={meshRef} castShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#C6F1FF"
            emissive="#102538"
            roughness={0.08}
            metalness={0.1}
            transmission={0.88}
            thickness={0.6}
            ior={1.48}
            transparent
            opacity={0.88}
          />
          <Edges scale={1.01} threshold={15} color="#7DEBFF" linewidth={1} />
        </mesh>
      </group>
    </Float>
  )
}

function CrystalComposition({ reducedMotion }) {
  const crystalRef = useRef(null)
  const rigRef = useRef(null)

  const crystalGeometry = useMemo(() => createIrregularCrystalGeometry(), [])

  useFrame(({ clock, mouse }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.14
      crystalRef.current.rotation.x = Math.sin(t * 0.22) * 0.08
      crystalRef.current.rotation.z = Math.cos(t * 0.18) * 0.04
    }
    if (rigRef.current) {
      rigRef.current.rotation.y = THREE.MathUtils.lerp(
        rigRef.current.rotation.y,
        mouse.x * 0.16,
        0.045,
      )
      rigRef.current.rotation.x = THREE.MathUtils.lerp(
        rigRef.current.rotation.x,
        -mouse.y * 0.1,
        0.045,
      )
    }
  })

  return (
    <group ref={rigRef}>
      {/* Centerpiece Giant Ice Crystal */}
      <Float
        speed={reducedMotion ? 0 : 1.2}
        rotationIntensity={reducedMotion ? 0 : 0.12}
        floatIntensity={reducedMotion ? 0 : 0.55}
        floatingRange={[-0.14, 0.14]}
      >
        <group ref={crystalRef} position={[0.2, 0, 0]} scale={0.92}>
          {/* Main outer realistic transparent ice crystal */}
          <mesh geometry={crystalGeometry} castShadow receiveShadow>
            <MeshTransmissionMaterial
              backside
              samples={4}
              resolution={256}
              transmission={1}
              thickness={0.95}
              roughness={0.06}
              ior={1.48}
              chromaticAberration={0.16}
              anisotropy={0.3}
              distortion={0.12}
              distortionScale={0.3}
              temporalDistortion={0.06}
              color="#d9f5ff"
              attenuationColor="#7debff"
              attenuationDistance={2.6}
            />
          </mesh>

          {/* Inner crystalline reflection structure */}
          <mesh geometry={crystalGeometry} scale={0.88}>
            <meshBasicMaterial color="#7debff" transparent opacity={0.14} wireframe />
          </mesh>

          {/* Facet razor edges */}
          <Edges scale={1.002} threshold={14} color="#7debff" linewidth={1.3} />

          {/* Internal crystalline radiance */}
          <pointLight color="#7debff" intensity={3.8} distance={4.8} />
        </group>
      </Float>

      {/* Floating Crystal Fragments orbiting the centerpiece */}
      <CrystalFragment
        position={[2.0, 1.35, -0.5]}
        scale={0.28}
        rotationSpeed={0.26}
        reducedMotion={reducedMotion}
      />
      <CrystalFragment
        position={[-1.85, -1.15, 0.6]}
        scale={0.23}
        rotationSpeed={-0.22}
        reducedMotion={reducedMotion}
      />
      <CrystalFragment
        position={[1.7, -1.45, -0.3]}
        scale={0.25}
        rotationSpeed={0.19}
        reducedMotion={reducedMotion}
      />
      <CrystalFragment
        position={[-1.75, 1.25, -0.7]}
        scale={0.29}
        rotationSpeed={-0.28}
        reducedMotion={reducedMotion}
      />
      <CrystalFragment
        position={[0.85, 2.05, 0.4]}
        scale={0.18}
        rotationSpeed={0.32}
        reducedMotion={reducedMotion}
      />
      <CrystalFragment
        position={[-1.15, -1.85, 0.3]}
        scale={0.22}
        rotationSpeed={-0.17}
        reducedMotion={reducedMotion}
      />

      {/* Atmospheric particles */}
      <Sparkles
        count={50}
        scale={[6.2, 5.2, 4.2]}
        size={1.9}
        speed={reducedMotion ? 0 : 0.24}
        color="#7debff"
        noise={1.5}
      />
      <Sparkles
        count={24}
        scale={[4.5, 4.0, 3.2]}
        size={2.8}
        speed={reducedMotion ? 0 : 0.14}
        color="#a8dfff"
        noise={1.2}
      />

      {/* Cinematic Lighting */}
      <ambientLight intensity={0.4} color="#070b12" />
      {/* Cyan Rim Light */}
      <pointLight position={[3.6, 2.8, -2.8]} intensity={4.5} color="#7debff" distance={8.5} />
      {/* Front-fill Glacier Light */}
      <pointLight position={[-3.2, -1.6, 2.6]} intensity={2.2} color="#172b3d" distance={7} />
      {/* White Key Highlight */}
      <directionalLight position={[0, 4.5, 3]} intensity={1.4} color="#f4faff" />
    </group>
  )
}

class SceneErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function SceneFallback() {
  return (
    <div className="scene-fallback" role="img" aria-label="Arctic Glass crystal 3D environment">
      <div className="fallback-crystal" />
      <div className="fallback-fragment fragment-1" />
      <div className="fallback-fragment fragment-2" />
      <div className="fallback-glimmer" />
      <p>WebGL fallback · Frozen crystal geometry active</p>
    </div>
  )
}

export default function HeroScene({ reducedMotion = false }) {
  const [webglReady, setWebglReady] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const supported = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
      )
      setWebglReady(supported)
    } catch {
      setWebglReady(false)
    }
  }, [])

  if (!webglReady) return <SceneFallback />

  return (
    <SceneErrorBoundary fallback={<SceneFallback />}>
      <Canvas
        dpr={[1, 1.4]}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.05, 5.8], fov: 40 }}
        onCreated={({ gl }) => gl.setClearColor('#070b12', 0)}
      >
        <CrystalComposition reducedMotion={reducedMotion} />
      </Canvas>
    </SceneErrorBoundary>
  )
}
