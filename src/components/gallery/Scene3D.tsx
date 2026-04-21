import * as THREE from 'three';
import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Environment, Preload } from '@react-three/drei';
import type { Image as GalleryImage } from '@/src/lib/useImages';
import { CarouselGroup } from './CarouselGroup';

const _camPos = new THREE.Vector3();

function CameraRig({ radius, isMobile }: { radius: number, isMobile: boolean }) {
  useFrame((state) => {
    // Pull camera back to see more of the carousel
    const camOffsetZ = isMobile ? radius + 15 : radius + 13;
    const camY = isMobile ? -0.5 : -0.5;
    _camPos.set(0, camY, camOffsetZ);
    state.camera.position.lerp(_camPos, 0.05);
    state.camera.lookAt(0, camY, radius - 2);
  });
  return null;
}

export function Scene3D({ images, currentIndex, isMobile, onSelect, onItemClick }: {
  images: GalleryImage[];
  currentIndex: number;
  isMobile: boolean;
  onSelect: (img: GalleryImage) => void;
  onItemClick: (index: number) => void;
}) {
  const total = images.length;
  if (total === 0) return null;
  
  const radius = isMobile 
    ? Math.max((total * 1.5) / Math.PI, 4.0) 
    : Math.max((total * 2.2) / Math.PI, 6.0);

  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 20] }}>
      <Suspense fallback={null}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', radius + 5, radius + 35]} />
        <Environment preset="city" />
        
        <CameraRig radius={radius} isMobile={isMobile} />

        <CarouselGroup 
          images={images} 
          currentIndex={currentIndex} 
          radius={radius}
          isMobile={isMobile}
          onSelect={onSelect} 
          onItemClick={onItemClick}
        />

        <Preload all />

        <mesh position={[0, isMobile ? -3.5 : -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={isMobile ? 512 : 1024}
            mixBlur={1}
            mixStrength={15}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#101010"
            metalness={0.5}
          />
        </mesh>
      </Suspense>
    </Canvas>
  );
}
