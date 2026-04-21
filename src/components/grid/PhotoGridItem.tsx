import { motion } from 'motion/react';
import type { Image } from '@/src/lib/useImages';
import { formatDate } from '@/src/lib/utils';

interface PhotoGridItemProps {
  image: Image;
  index: number;
  onSelect: (image: Image) => void;
}

export function PhotoGridItem({ image, index, onSelect }: PhotoGridItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
      className="break-inside-avoid mb-2 md:mb-3 group relative overflow-hidden rounded-md bg-white/5 cursor-pointer"
      onClick={() => onSelect(image)}
    >
      <img
        src={image.url}
        alt={image.groupName}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      {/* Subtle Metadata Overlay (Always visible but light) */}
      <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-0.5 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
        <span className="text-[10px] text-white/40 uppercase tracking-widest line-clamp-1 font-medium">
          {image.groupName}
        </span>
        <div className="flex items-center justify-between text-[8px] text-white/30 uppercase tracking-[0.2em]">
          <span className="font-semibold">{image.location}</span>
          {image.postedAt && <span>{formatDate(image.postedAt)}</span>}
        </div>
      </div>
      
      {/* Hover Detailed Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 md:p-6">
        <h3 className="text-base md:text-xl font-display italic text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {image.groupName}
        </h3>
        <div className="flex items-center justify-between text-[9px] md:text-[10px] uppercase tracking-widest text-white/60 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          <span>{image.location}</span>
          {image.postedAt && <span>{formatDate(image.postedAt)}</span>}
        </div>
      </div>
    </motion.div>
  );
}
