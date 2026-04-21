import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '@/src/lib/utils';
import type { Image } from '@/src/lib/useImages';

interface OverlayUIProps {
  images: Image[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (index: number) => void;
}

export function OverlayUI({ images, currentIndex, onPrev, onNext, onSelectIndex }: OverlayUIProps) {
  const currentImage = images[currentIndex];
  
  return (
    <>
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-end z-20 pointer-events-none">
        <div className="space-y-1">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium"
          >
            Curated Collection
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display italic text-white/90"
          >
            Lumina
          </motion.h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/30">Index</span>
            <span className="text-xl font-light tabular-nums text-white/90">
              {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Active Image Info */}
      <div className="absolute bottom-32 md:bottom-40 left-0 w-full flex flex-col items-center justify-center pointer-events-none z-10">
        <AnimatePresence mode="wait">
          {currentImage && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center px-4"
            >
              <h2 className="text-2xl md:text-4xl font-display italic text-white/90 mb-2 drop-shadow-lg line-clamp-2">
                {currentImage.groupName}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10px] md:text-xs uppercase tracking-widest text-white/60 drop-shadow-md">
                <span>{currentImage.location}</span>
                {currentImage.postedAt && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span>{formatDate(currentImage.postedAt)}</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 md:bottom-12 w-full flex flex-col items-center gap-6 md:gap-8 z-20 pointer-events-none">
        <div className="flex items-center gap-4 md:gap-12 pointer-events-auto w-full justify-center px-4">
          <button 
            onClick={onPrev}
            className="p-3 md:p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors group shrink-0 backdrop-blur-md bg-black/20"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-hover:text-white transition-colors" />
          </button>
          
          <div className="flex gap-1.5 md:gap-3 overflow-x-auto no-scrollbar max-w-[50vw] md:max-w-none items-center">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onSelectIndex(index)}
                className="group py-4 px-0.5 md:px-1 shrink-0"
              >
                <div className={cn(
                  "h-0.5 transition-all duration-500 rounded-full",
                  index === currentIndex ? "w-6 md:w-12 bg-white" : "w-2 md:w-4 bg-white/20 group-hover:bg-white/40"
                )} />
              </button>
            ))}
          </div>

          <button 
            onClick={onNext}
            className="p-3 md:p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors group shrink-0 backdrop-blur-md bg-black/20"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </>
  );
}
