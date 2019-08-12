import { useEffect, useRef } from 'react';

export default function useInterval(callback: any, delay: any): void {
  const savedCallback = useRef<any>('');
  // Remember the latest callback.
  useEffect((): void => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
