const chainIDToEnvironment: Record<string, string> = {
  D: 'devnet',
  T: 'testnet',
  '1': 'mainnet'
};

export function getEnvironmentForChainId(chainId: string) {
  return chainIDToEnvironment[chainId];
}
