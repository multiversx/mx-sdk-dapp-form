import { WEGLD_ID } from 'constants/index';

const chainIDToEnvironment: Record<string, string> = {
  D: 'devnet',
  T: 'testnet',
  '1': 'mainnet'
};

const chainIDToWegldId: Record<string, string> = {
  D: 'WEGLD-d7c6bb',
  T: 'WEGLD-7fbb90',
  '1': 'WEGLD-bd4d79'
};

export function getEnvironmentForChainId(chainId: string) {
  return chainIDToEnvironment[chainId];
}

export function getWegldIdForChainId(chainId: string) {
  return chainIDToWegldId[chainId] || WEGLD_ID;
}
