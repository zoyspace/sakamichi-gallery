import * as THREE from 'three';
import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { CarouselItem } from './CarouselItem';
import type { Image as GalleryImage } from '@/src/lib/useImages';

export function CarouselGroup({ images, currentIndex, radius, isMobile, onSelect, onItemClick }: {
  images: GalleryImage[];
  currentIndex: number;
  radius: number;
  isMobile: boolean;
  onSelect: (img: GalleryImage) => void;
  onItemClick: (index: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const introGroupRef = useRef<THREE.Group>(null);
  const introTime = useRef(0);
  const total = images.length;
  const angleStep = (Math.PI * 2) / total;

  const handleItemClick = useCallback((e: any, index: number, img: GalleryImage) => {
    e.stopPropagation();
    if (index === currentIndex) {
      onSelect(img);
    } else {
      onItemClick(index);
    }
  }, [currentIndex, onSelect, onItemClick]);

  useFrame((_state, delta) => {
    // 3-second entrance spin effect
    if (introGroupRef.current && introTime.current < 3) {
      introTime.current += delta;
      const progress = Math.min(introTime.current / 3, 1);
      // easeOutCubic curve for smooth slow down
      const easeOut = 1 - Math.pow(1 - progress, 3);
      // rotate backwards from full spin (Math.PI * 2) down to 0
      introGroupRef.current.rotation.y = -(1 - easeOut) * Math.PI * 2;
    }

    if (!groupRef.current) return;
    const targetY = currentIndex * angleStep;
    const currentY = groupRef.current.rotation.y;
    const diff = targetY - currentY;
    const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
    
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      currentY, currentY + normalizedDiff, 4, delta
    );
  });

  return (
    <group rotation={[0, 0, -Math.PI / 10]} position={[0, isMobile ? -0.5 : -1, 0]}>
      <group ref={introGroupRef}>
        <group ref={groupRef}>
          {images.map((img, i) => (
            <CarouselItem
              key={img.id}
              image={img}
              index={i}
              total={total}
              radius={radius}
              isActive={i === currentIndex}
              isMobile={isMobile}
              onClick={(e) => handleItemClick(e, i, img)}
            />
          ))}
        </group>
      </group>
    </group>
  );
}
