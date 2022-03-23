import { useState } from 'react';
import useComputeGasLimit from 'hooks/useComputeGasLimit';

export function useComputeInitGasLimit() {
  const computeInitialGasLimit = useComputeGasLimit();

  const [initGasLimit, setInitGasLimit] = useState('');
  const [initGasLimitError, setInitGasLimitError] = useState<string | null>(
    null
  );

  const computeGasLimit = async (computedTokenId: string) => {
    const gasData = await computeInitialGasLimit(computedTokenId);
    setInitGasLimit(gasData.initGasLimit);
    setInitGasLimitError(gasData.initGasLimitError);
  };

  return {
    computeGasLimit,
    initGasLimit,
    initGasLimitError
  };
}

export default useComputeInitGasLimit;
