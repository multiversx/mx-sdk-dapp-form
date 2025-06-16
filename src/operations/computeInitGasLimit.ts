import { GAS_LIMIT } from '@multiversx/sdk-dapp/constants/index';
import { isContract } from '@multiversx/sdk-dapp/utils/smartContracts';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import BigNumber from 'bignumber.js';
import { TOKEN_GAS_LIMIT, ZERO } from 'constants/index';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { DelegationContractDataType } from 'types';
import fetchGasLimit from '../hooks/useFetchGasLimit/fetchGasLimit';
import { calculateGasLimit } from './calculateGasLimit';
import { calculateNftGasLimit } from './calculateNftGasLimit';
import { getGuardedAccountGasLimit } from './getGuardedAccountGasLimit';

export interface ComputeInitGasLimitType {
  computedTokenId: string;
  receiver: string;
  isInternal: boolean;
  balance: string;
  address: string;
  isGuarded?: boolean;
  nonce: number;
  amount: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  chainId: string;
  delegationContractData: DelegationContractDataType | null;
  egldLabel: string;
  relayer?: string;
  relayerSignature?: string;
}

export const computeInitGasLimit: (props: ComputeInitGasLimitType) => Promise<{
  initGasLimit: string;
  initGasLimitError?: SendFormContainerPropsType['initGasLimitError'];
}> = async ({
  computedTokenId,
  receiver,
  isInternal,
  balance,
  address,
  isGuarded,
  nonce,
  amount,
  data,
  gasLimit,
  gasPrice,
  delegationContractData,
  chainId,
  relayer,
  relayerSignature
}) => {
  const guardedAccountGasLimit = getGuardedAccountGasLimit(isGuarded);
  const delegationContract = delegationContractData?.delegationContract;
  const delegationContractMinGasLimit =
    delegationContractData?.delegationContractData.minGasLimit ?? ZERO;

  const isUserDefinedGasLimit =
    !new BigNumber(gasLimit).isNaN() &&
    new BigNumber(gasLimit).isGreaterThan(ZERO);

  if (isUserDefinedGasLimit) {
    return { initGasLimit: gasLimit };
  }

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
        chainId,
        relayer,
        relayerSignature
      });

    const initGasLimit =
      receiver === delegationContract
        ? new BigNumber(resultedGasLimit)
            .plus(delegationContractMinGasLimit)
            .plus(guardedAccountGasLimit)
            .toString()
        : resultedGasLimit;

    return {
      initGasLimit,
      initGasLimitError: gasLimitCostError
    };
  }

  if (data.length > 0) {
    const initGasLimit = calculateGasLimit({
      data: data.trim(),
      isGuarded
    });
    return { initGasLimit };
  }

  const { isEsdt, isNft } = getIdentifierType(computedTokenId);

  if (isEsdt) {
    return {
      initGasLimit: new BigNumber(TOKEN_GAS_LIMIT)
        .plus(guardedAccountGasLimit)
        .toString()
    };
  }

  if (isNft) {
    return {
      initGasLimit: new BigNumber(calculateNftGasLimit())
        .plus(guardedAccountGasLimit)
        .toString()
    };
  }
  return {
    initGasLimit: new BigNumber(GAS_LIMIT)
      .plus(guardedAccountGasLimit)
      .toString()
  };
};
