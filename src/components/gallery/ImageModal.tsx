import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useScrollToClose } from '@/src/hooks/useScrollToClose';
import { cn, formatDate } from '@/src/lib/utils';
import type { Image } from '@/src/lib/useImages';

interface ImageModalProps {
  image: Image | null;
  onClose: () => void;
  layoutIdBase?: string;
}

export function ImageModal({ image, onClose, layoutIdBase }: ImageModalProps) {
  useScrollToClose(!!image, onClose);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={onClose}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-4 text-white/40 hover:text-white transition-colors z-[110] bg-black/20 rounded-full backdrop-blur-md"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <motion.div 
            ref={containerRef} 
            {...(layoutIdBase ? { layoutId: `${layoutIdBase}-${image.id}` } : {})}
            className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden"
          >
            <motion.img
              drag="x"
              dragConstraints={containerRef}
              dragElastic={0.2}
              src={image.url}
              alt={image.title}
              referrerPolicy="no-referrer"
              className="h-full w-auto max-w-none cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none flex flex-col items-start pb-12 md:pb-16 z-10">
              <a
                href={image.articleUrl || '#'}
                target={image.articleUrl ? "_blank" : "_self"}
                rel={image.articleUrl ? "noopener noreferrer" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!image.articleUrl) e.preventDefault();
                }}
                className={cn(
                  "pointer-events-auto inline-block",
                  image.articleUrl ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"
                )}
              >
                <motion.h2 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 2.5, delay: 0.2, ease: 'easeInOut' }}
                  className="text-3xl md:text-6xl font-display italic mb-2 line-clamp-3 text-white"
                >
                  {image.title}
                </motion.h2>
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 2.5, delay: 0.8, ease: 'easeInOut' }}
                  className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/80"
                >
                  <span>{image.location}</span>
                  {image.postedAt && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                      <span>{formatDate(image.postedAt)}</span>
                    </>
                  )}
                </motion.div>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
