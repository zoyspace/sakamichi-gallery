import { useState } from 'react';
import { useMobile } from '@/src/hooks/useMobile';
import { useSwipe } from '@/src/hooks/useSwipe';
import type { Image as GalleryImage } from '@/src/lib/useImages';
import { Scene3D } from './Scene3D';
import { OverlayUI } from './OverlayUI';
import { ImageModal } from './ImageModal';

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const isMobile = useMobile();

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const { handlers: swipeHandlers } = useSwipe({
    onSwipeLeft: prev,
    onSwipeRight: next,
    disabled: selectedImage !== null
  });

  return (
    <div 
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505] touch-pan-y"
      {...swipeHandlers}
    >
      <div className="absolute inset-0 z-0">
        <Scene3D 
          images={images} 
          currentIndex={currentIndex} 
          isMobile={isMobile}
          onSelect={setSelectedImage}
          onItemClick={setCurrentIndex}
        />
      </div>

      <OverlayUI 
        images={images}
        currentIndex={currentIndex}
        onPrev={prev}
        onNext={next}
        onSelectIndex={setCurrentIndex}
      />

      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
}
