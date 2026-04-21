import { useRef } from 'react';

interface UseSwipeProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  disabled?: boolean;
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50, disabled = false }: UseSwipeProps) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const start = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return;
    
    let clientX = 0;
    if ('touches' in e) clientX = e.touches[0].clientX;
    else clientX = (e as React.MouseEvent).clientX;
    
    touchStartX.current = clientX;
    touchEndX.current = clientX;
  };

  const move = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || !touchStartX.current) return;
    
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      if ((e as React.MouseEvent).buttons !== 1) return;
      clientX = (e as React.MouseEvent).clientX;
    }
    touchEndX.current = clientX;
  };

  const end = () => {
    if (disabled || !touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    
    if (distance > threshold) {
      onSwipeLeft();
    } else if (distance < -threshold) {
      onSwipeRight();
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return {
    handlers: {
      onTouchStart: start,
      onTouchMove: move,
      onTouchEnd: end,
      onMouseDown: start,
      onMouseMove: move,
      onMouseUp: end,
      onMouseLeave: end,
    }
  };
}
