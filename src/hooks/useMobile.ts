import { useState, useEffect } from 'react';

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile(); // Initial check
    
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', debouncedCheck);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheck);
    };
  }, [breakpoint]);

  return isMobile;
}
