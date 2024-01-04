import { getDelegationDataForChainId } from 'apiCalls';
import { computeInitGasLimit, ComputeInitGasLimitType } from 'operations';
import { GetInitialValuesType } from './types';

export const getInitialGasLimit = async (
  props: GetInitialValuesType & { computedTokenId: string }
) => {
  const { configValues, ...rest } = props;
  const delegationContractData = getDelegationDataForChainId(props.chainId);

  const computeGasLimitProps: ComputeInitGasLimitType = {
    isInternal: ['1', 'T'].includes(props.chainId),
    ...rest,
    ...configValues,
    delegationContractData
  };

  return computeInitGasLimit(computeGasLimitProps);
};
