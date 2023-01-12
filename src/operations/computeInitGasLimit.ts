import { GAS_LIMIT } from '@multiversx/sdk-dapp/constants/index';
import { isContract } from '@multiversx/sdk-dapp/utils/smartContracts';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';

import BigNumber from 'bignumber.js';
import { TOKEN_GAS_LIMIT, ZERO } from 'constants/index';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { DelegationContractDataType } from 'types';
import fetchGasLimit from '../hooks/useFetchGasLimit/fetchGasLimit';
import calculateGasLimit from './calculateGasLimit';
import { calculateNftGasLimit } from './calculateNftGasLimit';

export interface ComputeInitGasLimitType {
  computedTokenId: string;
  receiver: string;
  isInternal: boolean;
  balance: string;
  address: string;
  nonce: number;
  amount: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  chainId: string;
  delegationContractData: DelegationContractDataType;
  egldLabel: string;
}

export const computeInitGasLimit: (
  props: ComputeInitGasLimitType
) => Promise<{
  initGasLimit: string;
  initGasLimitError?: SendFormContainerPropsType['initGasLimitError'];
}> = async ({
  computedTokenId,
  receiver,
  isInternal,
  balance,
  address,
  nonce,
  amount,
  data,
  gasLimit,
  gasPrice,
  delegationContractData: { delegationContractData, delegationContract },
  chainId
}) => {
  if (isContract(receiver) && !isInternal) {
    const {
      gasLimit: resultedGasLimit,
      gasLimitCostError
    } = await fetchGasLimit({
      balance,
      address,
      nonce,
      values: {
        amount,
        receiver,
        data,
        gasLimit,
        gasPrice
      },
      chainId
    });

    const initGasLimit =
      receiver === delegationContract
        ? new BigNumber(resultedGasLimit)
            .plus(delegationContractData.minGasLimit)
            .toString()
        : resultedGasLimit;

    return {
      initGasLimit,
      initGasLimitError: gasLimitCostError
    };
  }

  if (gasLimit !== ZERO) {
    return { initGasLimit: gasLimit };
  }

  if (data.length > 0) {
    const initGasLimit = calculateGasLimit({
      data: data.trim()
    });
    return { initGasLimit };
  }

  const { isEsdt, isNft } = getIdentifierType(computedTokenId);

  if (isEsdt) {
    return { initGasLimit: TOKEN_GAS_LIMIT };
  }

  if (isNft) {
    return { initGasLimit: calculateNftGasLimit() };
  }
  return { initGasLimit: String(GAS_LIMIT) };
};
