import { isContract, constants } from '@elrondnetwork/dapp-core';
import BigNumber from 'bignumber.js';
import { tokenGasLimit } from 'constants/index';
import { DelegationContractDataType } from 'types';
import fetchGasLimit from '../hooks/useFetchGasLimit/fetchGasLimit';
import getIdentifierType from '../validation/getIdentifierType';
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

export const computeInitGasLimit: (props: ComputeInitGasLimitType) => Promise<{
  initGasLimit: string;
  initGasLimitError: string | null;
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
  const initGasLimitError = null;
  if (isContract(receiver) && !isInternal) {
    const { gasLimit: resultedGasLimit, gasLimitCostError } =
      await fetchGasLimit({
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
      initGasLimitError: gasLimitCostError || null
    };
  }

  if (gasLimit !== '0') {
    return { initGasLimit: gasLimit, initGasLimitError };
  }

  if (data.length > 0) {
    const initGasLimit = calculateGasLimit({
      data: data.trim()
    });
    return { initGasLimit, initGasLimitError };
  }

  const { isEsdt, isNft } = getIdentifierType(computedTokenId);

  if (isEsdt) {
    return { initGasLimit: tokenGasLimit, initGasLimitError };
  }

  if (isNft) {
    return { initGasLimit: calculateNftGasLimit(), initGasLimitError };
  }
  return { initGasLimit: constants.gasLimit, initGasLimitError };
};
