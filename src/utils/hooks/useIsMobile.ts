import isMobile from 'is-mobile';
import { useEffect, useState } from 'react';

export const useIsMobile = () => {
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    const handleResize = () => {
      const currentMobile = isMobile();

      if (currentMobile !== mobile) {
        setMobile(currentMobile);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [mobile]);

  return mobile;
};
