import { useEffect } from "react";

// UseEffect wrapper to run logic on mount only once
export function useOnMount(func: React.EffectCallback): void {
  // Disable hook dependency error; we only want to run once
  // eslint-disable-next-line
  useEffect(func, []);
}
