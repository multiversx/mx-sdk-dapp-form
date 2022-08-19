import { DelegationContractDataType } from 'types';
import { getEnvironmentForChainId } from './getEnvironmentForChainId';

export const delegationContractDataByEnvironment: Record<
  string,
  DelegationContractDataType
> = {
  mainnet: {
    delegationContract:
      'erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt',
    delegationContractData: {
      minGasLimit: '75000000'
    }
  },
  devnet: {
    delegationContract:
      'erd1qqqqqqqqqqqqqpgqp699jngundfqw07d8jzkepucvpzush6k3wvqyc44rx',
    delegationContractData: {
      minGasLimit: '75000000'
    }
  },
  testnet: {
    delegationContract:
      'erd1qqqqqqqqqqqqqpgqp699jngundfqw07d8jzkepucvpzush6k3wvqyc44rx',
    delegationContractData: {
      minGasLimit: '75000000'
    }
  }
};

export function getDelegationDataForChainId(chainId: string) {
  const environment = getEnvironmentForChainId(chainId);
  return delegationContractDataByEnvironment[environment];
}
