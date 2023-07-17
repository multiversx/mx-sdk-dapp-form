import { useState, useEffect } from 'react';

import {
  GetInitialValuesReturnType,
  getInitialValues
} from './getInitialValues';
import { GetInitialValuesType } from './getInitialValues/types';

export { GetInitialValuesReturnType };

export function useGetInitialValues(
  props: GetInitialValuesType
): GetInitialValuesReturnType | null {
  const [state, setState] = useState<GetInitialValuesReturnType | null>(null);

  async function getValues() {
    const values: GetInitialValuesReturnType = await getInitialValues(props);
    setState(values);
  }

  useEffect(() => {
    getValues();
  }, []);

  return state;
}
