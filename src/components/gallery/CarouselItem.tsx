import * as THREE from 'three';
import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import ErrorBoundary from './ErrorBoundary';
import type { Image as GalleryImage } from '@/src/lib/useImages';

interface CarouselItemProps {
  image: GalleryImage; 
  index: number; 
  total: number; 
  radius: number; 
  isActive: boolean; 
  isMobile: boolean;
  onClick: (e: any) => void;
}

export function CarouselItem({ 
  image, index, total, radius, isActive, isMobile, onClick 
}: CarouselItemProps) {
  const ref = useRef<THREE.Mesh>(null);
  const itemWidth = isMobile ? 3 : 4.5;
  const itemHeight = isMobile ? 4 : 6;
  const angleStep = (Math.PI * 2) / total;
  const angle = -index * angleStep;
  
  // Distribute along cylinder
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  
  useFrame((_state, delta) => {
    if (!ref.current) return;
    const targetScale = isActive ? 1.15 : 0.85;
    const targetW = itemWidth * targetScale;
    const targetH = itemHeight * targetScale;
    
    // Use scalar lerps to avoid Vector3 churn and race conditions
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, targetW, delta * 5);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetH, delta * 5);
  });

  return (
    <group position={[x, 0, z]} rotation={[0, angle, 0]}>
      <ErrorBoundary fallback={
        <mesh onClick={onClick} scale={[itemWidth, itemHeight, 1]}>
          <planeGeometry /><meshBasicMaterial color="#222" />
        </mesh>
      }>
        <Suspense fallback={
          <mesh scale={[itemWidth, itemHeight, 1]}>
            <planeGeometry /><meshBasicMaterial color="#111" />
          </mesh>
        }>
          <Image
            ref={ref}
            url={`/api/proxy-image?url=${encodeURIComponent(image.url)}`}
            transparent
            radius={0.05}
            scale={[itemWidth, itemHeight]}
            onClick={onClick}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          />
        </Suspense>
      </ErrorBoundary>
    </group>
  );
}
