import { useEffect, useState } from 'react';

interface UseDelayedRenderArgs {
  delayMs?: number;
  mounted?: boolean;
}

export const useDelayedRender = ({ delayMs = 500, mounted = false }: UseDelayedRenderArgs) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (mounted && !shouldRender) {
      setShouldRender(true);
    } else if (!mounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayMs);
    }

    return () => clearTimeout(timeoutId);
  }, [mounted, delayMs, shouldRender]);

  return shouldRender;
};
