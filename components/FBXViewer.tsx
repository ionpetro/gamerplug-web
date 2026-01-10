'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { AnimationMixer, Box3, Vector3, TextureLoader } from 'three'
import * as THREE from 'three'

interface FBXModelProps {
  url: string
  texturePath?: string
}

function setGroupOpacity(group: THREE.Object3D, opacity: number) {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    const material = child.material
    const apply = (m: THREE.Material) => {
      const mat = m as THREE.MeshStandardMaterial
      // Ensure opacity actually works
      mat.transparent = true
      mat.opacity = opacity
      // Helps avoid harsh sorting artifacts during fades
      mat.depthWrite = opacity >= 0.999
      mat.needsUpdate = true
    }

    if (Array.isArray(material)) {
      material.forEach(apply)
    } else if (material) {
      apply(material)
    }
  })
}

function disposeGroup(group: THREE.Object3D) {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    child.geometry?.dispose?.()
    const material = child.material
    const dispose = (m: THREE.Material) => m.dispose?.()

    if (Array.isArray(material)) {
      material.forEach(dispose)
    } else if (material) {
      dispose(material)
    }
  })
}

function FBXModel({ url, texturePath }: FBXModelProps) {
  const modelRef = useRef<THREE.Group>(null)
  const currentMixerRef = useRef<AnimationMixer | null>(null)
  const nextMixerRef = useRef<AnimationMixer | null>(null)

  const [currentModel, setCurrentModel] = useState<THREE.Group | null>(null)
  const [nextModel, setNextModel] = useState<THREE.Group | null>(null)
  // Keep transition progress in a ref to avoid per-frame React state updates (smoother fades).
  const transitionTRef = useRef(1) // 0..1 (1 means "not transitioning")

  useEffect(() => {
    let cancelled = false

    const loader = new FBXLoader()

    loader.load(
      url,
      (fbx) => {
        if (cancelled) return

        // Center the model
        const box = new Box3().setFromObject(fbx)
        const center = box.getCenter(new Vector3())
        fbx.position.sub(center)

        // Scale the model to fit in view (zoomed in)
        const size = box.getSize(new Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 4 / maxDim  // Increased from 3 to 5 for closer zoom
        fbx.scale.multiplyScalar(scale)

        // Make sure we can fade it in/out (even before texture load)
        setGroupOpacity(fbx, 0)

        // Apply texture if provided
        if (texturePath) {
          const textureLoader = new TextureLoader()
          textureLoader.load(
            texturePath,
            (texture) => {
              if (cancelled) return

              texture.flipY = true // Rodin AI textures typically need to be flipped
              texture.wrapS = THREE.RepeatWrapping
              texture.wrapT = THREE.RepeatWrapping
              
              // Traverse all meshes and apply texture
              fbx.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    color: 0xffffff // Ensure full color intensity
                  })
                  child.material = material
                }
              })

              // Ensure new materials can fade
              setGroupOpacity(fbx, 0)

              // Set up animations if they exist
              if (fbx.animations && fbx.animations.length > 0) {
                const mixer = new AnimationMixer(fbx)
                nextMixerRef.current = mixer
                const action = mixer.clipAction(fbx.animations[0])
                action.play()
              }

              // If this is the first model, show it immediately (no blank state).
              transitionTRef.current = 0
              setNextModel(fbx)
            },
            undefined,
            (error) => {
              console.error('Error loading texture:', error)
              if (cancelled) return

              if (fbx.animations && fbx.animations.length > 0) {
                const mixer = new AnimationMixer(fbx)
                nextMixerRef.current = mixer
                const action = mixer.clipAction(fbx.animations[0])
                action.play()
              }

              transitionTRef.current = 0
              setNextModel(fbx)
            }
          )
        } else {
          // Set up animations if they exist
          if (fbx.animations && fbx.animations.length > 0) {
            const mixer = new AnimationMixer(fbx)
            nextMixerRef.current = mixer
            const action = mixer.clipAction(fbx.animations[0])
            action.play()
          }

          transitionTRef.current = 0
          setNextModel(fbx)
        }
      },
      (xhr) => {
        // Intentionally no UI spinners / progress logs
        void xhr
      },
      (error) => {
        console.error('Error loading FBX:', error)
      }
    )

    return () => {
      cancelled = true
    }
  }, [url, texturePath])

  useFrame((state, delta) => {
    // Drive both mixers during a transition
    currentMixerRef.current?.update(delta)
    nextMixerRef.current?.update(delta)

    if (!nextModel) return

    // Faster + smoother fade:
    // - Use a short duration (in seconds), not a linear "speed" (less error-prone)
    // - Ease with smoothstep for a more natural crossfade
    const hasCurrent = !!currentModel
    const durationSec = hasCurrent ? 0.22 : 0.14
    const nextTLinear = Math.min(1, transitionTRef.current + delta / durationSec)
    transitionTRef.current = nextTLinear
    const easedT = nextTLinear * nextTLinear * (3 - 2 * nextTLinear) // smoothstep

    if (currentModel) setGroupOpacity(currentModel, 1 - easedT)
    setGroupOpacity(nextModel, easedT)

    if (nextTLinear >= 1) {
      // Finalize the swap
      const prev = currentModel
      setCurrentModel(nextModel)
      setNextModel(null)
      transitionTRef.current = 1

      // Move next mixer -> current mixer
      currentMixerRef.current?.stopAllAction()
      currentMixerRef.current = nextMixerRef.current
      nextMixerRef.current = null

      if (prev) {
        // Avoid leaking GPU resources
        disposeGroup(prev)
      }
    }
  })

  // Render both during the crossfade. Never render "nothing" during load.
  return (
    <group ref={modelRef}>
      {currentModel ? <primitive object={currentModel} /> : null}
      {nextModel ? <primitive object={nextModel} /> : null}
    </group>
  )
}

export default function FBXViewer({ modelPath, texturePath, characterId }: { modelPath: string; texturePath?: string; characterId?: string }) {
  // Camera positioned straight forward at chest height (waist to head view)
  const isBill = characterId === 'bill-klehm'
  const cameraY = isBill ? 1.0 : 1.8
  const targetY = cameraY // Look straight ahead at same height
  
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, cameraY, 3.5]} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={5}
          target={[0, targetY, 0]}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        {/* <pointLight position={[0, 3, 0]} intensity={0.3} /> */}

        {/* Model */}
        <FBXModel url={modelPath} texturePath={texturePath} />
      </Canvas>
    </div>
  )
}
