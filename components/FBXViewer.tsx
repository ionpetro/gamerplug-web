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

function FBXModel({ url, texturePath }: FBXModelProps) {
  const modelRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<AnimationMixer | null>(null)
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setModel(null)
    
    const loader = new FBXLoader()
    
    loader.load(
      url,
      (fbx) => {
        // Center the model
        const box = new Box3().setFromObject(fbx)
        const center = box.getCenter(new Vector3())
        fbx.position.sub(center)

        // Scale the model to fit in view (zoomed in)
        const size = box.getSize(new Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 5 / maxDim  // Increased from 3 to 5 for closer zoom
        fbx.scale.multiplyScalar(scale)

        // Apply texture if provided
        if (texturePath) {
          const textureLoader = new TextureLoader()
          textureLoader.load(
            texturePath,
            (texture) => {
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
              
              setModel(fbx)
              setIsLoading(false)
            },
            undefined,
            (error) => {
              console.error('Error loading texture:', error)
              setModel(fbx)
              setIsLoading(false)
            }
          )
        } else {
          setModel(fbx)
          setIsLoading(false)
        }

        // Set up animations if they exist
        if (fbx.animations && fbx.animations.length > 0) {
          const mixer = new AnimationMixer(fbx)
          mixerRef.current = mixer
          const action = mixer.clipAction(fbx.animations[0])
          action.play()
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.error('Error loading FBX:', error)
        setIsLoading(false)
      }
    )

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
      }
      setIsLoading(true)
      setModel(null)
    }
  }, [url, texturePath])

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001
    }
  })

  if (isLoading || !model) return null
  
  return <primitive ref={modelRef} object={model} />
}

export default function FBXViewer({ modelPath, texturePath }: { modelPath: string; texturePath?: string }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[1.5, 3.2, 2.5]} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={5}
          target={[0, 2.5, 0]}
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
