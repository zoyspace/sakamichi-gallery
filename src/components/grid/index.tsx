import { useState } from 'react';
import { motion } from 'motion/react';
import type { Image } from '@/src/lib/useImages';
import { PhotoGridItem } from './PhotoGridItem';
import { ImageModal } from '../gallery/ImageModal';

export default function PhotoGrid({ images }: { images: Image[] }) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-32 relative z-10 bg-black">
      <div className="mb-20 flex flex-col items-center text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.4em] text-white/40 mb-4"
        >
          Explore All Works
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-display italic text-white/90"
        >
          The Collection
        </motion.h2>
      </div>
      
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-3">
        {images.map((image, index) => (
          <PhotoGridItem 
            key={image.id}
            image={image}
            index={index}
            onSelect={setSelectedImage}
          />
        ))}
      </div>

      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)}
        layoutIdBase="grid-image"
      />
    </section>
  );
}
