import { useState, useEffect } from 'react';

const debounceValueInitial = {
  value: '',
  count: 0
};

export interface ImprovedDebounceValueType {
  value: string;
  count: number;
}

export const useImprovedDebounce = (
  debounceValue: ImprovedDebounceValueType,
  timeout: number
) => {
  const [state, setState] =
    useState<ImprovedDebounceValueType>(debounceValueInitial);

  const effect = () => {
    const handler = setTimeout(() => {
      setState(debounceValue);
    }, timeout);

    return () => clearTimeout(handler);
  };

  useEffect(effect, [debounceValue.count]);

  return state;
};
