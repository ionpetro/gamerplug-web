'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { AnimationMixer, Box3, Vector3 } from 'three'
import * as THREE from 'three'

interface FBXModelProps {
  url: string
}

type FadeMat = {
  mat: THREE.Material & {
    opacity?: number
    transparent?: boolean
    depthWrite?: boolean
    depthTest?: boolean
  }
  originalOpacity: number
  originalTransparent: boolean
  originalDepthWrite: boolean
}

function prepareFadeGroup(group: THREE.Object3D) {
  const mats: FadeMat[] = []
  const meshes: THREE.Mesh[] = []

  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    meshes.push(child)

    const material = child.material
    const collect = (m: THREE.Material) => {
      const mat = m as FadeMat['mat']
      mats.push({
        mat,
        originalOpacity: typeof mat.opacity === 'number' ? mat.opacity : 1,
        originalTransparent: !!mat.transparent,
        originalDepthWrite: typeof mat.depthWrite === 'boolean' ? mat.depthWrite : true,
      })
    }

    if (Array.isArray(material)) material.forEach(collect)
    else if (material) collect(material)
  })

  group.userData.__fadeMats = mats
  group.userData.__fadeMeshes = meshes
}

function applyFade(group: THREE.Object3D, fade01: number, renderOrder = 0) {
  const mats = group.userData.__fadeMats as FadeMat[] | undefined
  const meshes = group.userData.__fadeMeshes as THREE.Mesh[] | undefined
  if (!mats || !meshes) return

  group.renderOrder = renderOrder
  for (const mesh of meshes) mesh.renderOrder = renderOrder

  const isFullyOpaque = fade01 >= 0.999

  for (const entry of mats) {
    const mat = entry.mat

    if (typeof mat.opacity === 'number') mat.opacity = entry.originalOpacity * fade01
    if (typeof mat.depthTest === 'boolean') mat.depthTest = true

    // Only toggle transparency at thresholds (avoids per-frame shader/sort churn)
    const targetTransparent = entry.originalTransparent || !isFullyOpaque
    if (typeof mat.transparent === 'boolean' && mat.transparent !== targetTransparent) {
      mat.transparent = targetTransparent
      mat.needsUpdate = true
    }

    // During fades, disable depthWrite to avoid z-fighting artifacts.
    const targetDepthWrite = isFullyOpaque ? entry.originalDepthWrite : false
    if (typeof mat.depthWrite === 'boolean') mat.depthWrite = targetDepthWrite
  }
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

function FBXModel({ url }: FBXModelProps) {
  const rootRef = useRef<THREE.Group>(null)
  const currentMixerRef = useRef<AnimationMixer | null>(null)
  const nextMixerRef = useRef<AnimationMixer | null>(null)

  const currentModelRef = useRef<THREE.Group | null>(null)
  const nextModelRef = useRef<THREE.Group | null>(null)
  // Keep transition progress in a ref to avoid per-frame React state updates (smoother fades).
  const transitionTRef = useRef(1) // 0..1 (1 means "not transitioning")

  useEffect(() => {
    let cancelled = false

    const loader = new FBXLoader()
    const textureLoader = new THREE.TextureLoader()

    loader.load(
      url,
      (fbx) => {
        if (cancelled) {
          disposeGroup(fbx)
          return
        }

        // Function to finalize model setup
        const finalizeModel = () => {
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

          prepareFadeGroup(fbx)
          // Make sure we can fade it in/out (start invisible)
          applyFade(fbx, 0, 1)

          // Set up animations if they exist
          if (fbx.animations && fbx.animations.length > 0) {
            const mixer = new AnimationMixer(fbx)
            nextMixerRef.current = mixer
            const action = mixer.clipAction(fbx.animations[0])
            action.play()
          }

          transitionTRef.current = 0
          rootRef.current?.add(fbx)
          nextModelRef.current = fbx
        }

        // Load and apply texture based on model filename
        const modelName = url.split('/').pop()?.replace('.fbx', '')
        if (modelName) {
          const texturePath = `/models/${modelName}_texture.png`

          textureLoader.load(
            texturePath,
            (texture) => {
              if (cancelled) return

              // Apply texture to all meshes in the model
              fbx.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  const material = child.material

                  const applyTexture = (mat: THREE.Material) => {
                    if (mat instanceof THREE.MeshStandardMaterial ||
                        mat instanceof THREE.MeshPhongMaterial ||
                        mat instanceof THREE.MeshLambertMaterial) {
                      mat.map = texture
                      mat.needsUpdate = true
                    }
                  }

                  if (Array.isArray(material)) {
                    material.forEach(applyTexture)
                  } else if (material) {
                    applyTexture(material)
                  }
                }
              })

              // Finalize model setup after texture is applied
              finalizeModel()
            },
            undefined,
            (error) => {
              console.warn('Texture loading failed, proceeding without texture:', error)
              // Proceed even if texture fails to load
              finalizeModel()
            }
          )
        } else {
          // No texture to load, proceed immediately
          finalizeModel()
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

      // Clean up scene objects on unmount/url change
      const current = currentModelRef.current
      const next = nextModelRef.current
      if (current) {
        rootRef.current?.remove(current)
        disposeGroup(current)
      }
      if (next) {
        rootRef.current?.remove(next)
        disposeGroup(next)
      }
      currentModelRef.current = null
      nextModelRef.current = null
    }
  }, [url])

  useFrame((state, delta) => {
    // Drive both mixers during a transition
    currentMixerRef.current?.update(delta)
    nextMixerRef.current?.update(delta)

    const currentModel = currentModelRef.current
    const nextModel = nextModelRef.current
    if (!nextModel) return

    // Sequential fade: fade out current first, then fade in next
    // This avoids overlapping transparent models which cause z-fighting
    const hasCurrent = !!currentModel
    const fadeOutDuration = 0.15
    const fadeInDuration = 0.2
    const totalDuration = hasCurrent ? fadeOutDuration + fadeInDuration : fadeInDuration

    const nextT = Math.min(1, transitionTRef.current + delta / totalDuration)
    transitionTRef.current = nextT

    if (hasCurrent) {
      // Sequential: first half fades out current, second half fades in next
      const fadeOutProgress = Math.min(1, nextT * (totalDuration / fadeOutDuration))
      const fadeInProgress = Math.max(0, (nextT * totalDuration - fadeOutDuration) / fadeInDuration)
      
      // Smooth easing
      const fadeOutEased = 1 - (fadeOutProgress * fadeOutProgress)
      const fadeInEased = fadeInProgress * fadeInProgress * (3 - 2 * fadeInProgress)
      
      applyFade(currentModel!, fadeOutEased, 0)
      applyFade(nextModel, fadeInEased, 1)
    } else {
      // No current model, just fade in the next
      const fadeInEased = nextT * nextT * (3 - 2 * nextT)
      applyFade(nextModel, fadeInEased, 0)
    }

    if (nextT >= 1) {
      // Finalize the swap
      const prev = currentModelRef.current
      const next = nextModelRef.current
      if (!next) return

      // Ensure new one is fully opaque + restored.
      applyFade(next, 1, 0)

      currentModelRef.current = next
      nextModelRef.current = null
      transitionTRef.current = 1

      // Move next mixer -> current mixer
      currentMixerRef.current?.stopAllAction()
      currentMixerRef.current = nextMixerRef.current
      nextMixerRef.current = null

      if (prev) {
        // Remove from scene BEFORE dispose (prevents one-frame render of disposed resources)
        rootRef.current?.remove(prev)
        disposeGroup(prev)
      }
    }
  })

  // Render both during the crossfade. Never render "nothing" during load.
  return (
    <group ref={rootRef} />
  )
}

export default function FBXViewer({ modelPath, characterId }: { modelPath: string; characterId?: string }) {
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

        {/* Model */}
        <FBXModel url={modelPath} />
      </Canvas>
    </div>
  )
}
