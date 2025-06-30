import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import { WEGLD_ID } from 'constants/index';

const chainIDToEnvironment: Record<string, EnvironmentsEnum> = {
  D: EnvironmentsEnum.devnet,
  T: EnvironmentsEnum.testnet,
  '1': EnvironmentsEnum.mainnet
};

const chainIDToWegldId: Record<string, string> = {
  D: 'WEGLD-d7c6bb',
  T: 'WEGLD-71e90a',
  '1': 'WEGLD-bd4d79'
};

export function getEnvironmentForChainId(chainId: string) {
  return chainIDToEnvironment[chainId];
}

export function getWegldIdForChainId(chainId: string) {
  return chainIDToWegldId[chainId] || WEGLD_ID;
}
