import React, { FC, ReactNode, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import classes from './Tooltip.module.scss';
import { useIsMobile } from 'utils/hooks/useIsMobile';

interface TooltipProps {
  tooltipMessage: string;
  children: ReactNode;
  className?: string;
}

export const Tooltip: FC<TooltipProps> = ({ tooltipMessage, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const handleClick = () => {
    setIsVisible(true);

    // Clear any existing timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timeout to hide tooltip after 10 seconds
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className={cn(classes.tooltipContainer, className)} onClick={handleClick}>
      {children}
      {isVisible && (
        <div
          className={cn(classes.tooltip, {
            [classes.tooltipTop]: isMobile,
            [classes.tooltipLeft]: !isMobile,
          })}>
          {tooltipMessage}
        </div>
      )}
    </div>
  );
};
