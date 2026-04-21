import { useEffect } from 'react';

export function useScrollToClose(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 20) onClose();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (Math.abs(touchEndY - touchStartY) > 50) onClose();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
}
