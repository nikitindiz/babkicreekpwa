import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

interface FadeOnMountEventsProps {
  children: ReactNode;
  show?: boolean;
  from?: Keyframe;
  to?: Keyframe;
  unMountAnimation?: [Keyframe, Keyframe];
  options?: KeyframeAnimationOptions;
}

export const FadeOnMountEvents: FC<FadeOnMountEventsProps> = ({
  show = false,
  children,
  from = { opacity: 0 },
  to = { opacity: 1 },
  unMountAnimation,
  options = { duration: 500, fill: 'forwards' },
}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [removeState, setRemove] = useState(!show);

  useEffect(() => {
    const childElement = elementRef.current;
    if (show) {
      setRemove(false);
      if (!childElement) return;
      childElement.animate([from, to], options);
    } else {
      if (!childElement) return;
      const animation = childElement.animate(unMountAnimation || [to, from], options);
      animation.onfinish = () => {
        setRemove(true);
      };
    }
  }, [show, removeState, from, to, options, unMountAnimation]);

  return !removeState ? <div ref={elementRef}>{children}</div> : null;
};
