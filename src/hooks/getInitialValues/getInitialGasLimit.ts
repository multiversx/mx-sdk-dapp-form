import { getDelegationDataForChainId } from 'apiCalls';
import { computeInitGasLimit, ComputeInitGasLimitType } from 'operations';
import { GetInitialValuesType } from './types';

export async function getInitialGasLimit(
  props: GetInitialValuesType & { computedTokenId: string }
) {
  const { configValues, ...rest } = props;
  const delegationContractData = await getDelegationDataForChainId(
    props.chainId
  );

  const computeGasLimitProps: ComputeInitGasLimitType = {
    isInternal: ['1', 'T'].includes(props.chainId),
    ...rest,
    ...configValues,
    delegationContractData
  };
  const initGasLimitData = await computeInitGasLimit(computeGasLimitProps);
  return initGasLimitData;
}

export default getInitialGasLimit;
