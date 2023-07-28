import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, timeout: number): T {
  const [state, setState] = useState(value);

  const effect = () => {
    const handler = setTimeout(() => setState(value), timeout);

    return () => clearTimeout(handler);
  };

  useEffect(effect, [value]);

  return state;
}

export default useDebounce;
