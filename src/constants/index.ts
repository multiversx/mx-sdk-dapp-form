export const gasPriceModifier = '0.01';
export const gasPerDataByte = '1500';
export const gasLimit = '50000';
export const defaultGasPrice = '1000000000';
export const defaultGasLimit = 60_000_000;
export const denomination = 18;
export const maxGasLimit = '600000000';
export const gasLimitDelta = 10;
export const tokenGasLimit = '500000';
export const decimals = 4;
export const minDust = '5000000000000000'; // 0.05 EGLD
export const version = 1;

export const delegationContractData = {
  minGasLimit: '75000000',
  claim: {
    gasLimit: (20_000_000).toString(),
    data: 'claimRewards'
  },
  delegate: {
    gasLimit: (75_000_000).toString(),
    data: 'stake'
  },
  initializeWithdrawal: {
    gasLimit: (20_000_000).toString(),
    data: 'unStake@' // unStake@hex.encode(valueToBeUnStaked),
  },
  unBond: {
    gasLimit: (75_000_000).toString(),
    data: 'unBond'
  }
};
