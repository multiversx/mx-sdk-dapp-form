import {
  Transaction,
  Nonce,
  Balance,
  Address,
  GasPrice,
  GasLimit,
  ChainID,
  TransactionPayload,
  TransactionVersion
} from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import {
  defaultGasLimit,
  defaultGasPrice,
  version as defaultVersion
} from 'constants/index';
import { SignTxType } from './validateTransaction';

export const newTransaction = (props: SignTxType & { chainId: string }) => {
  const { value, receiver, gasLimit, gasPrice, data, nonce, chainId, version } =
    props;

  const transaction = new Transaction({
    nonce: new Nonce(Number(nonce)),
    value: Balance.fromString(String(value)),
    receiver: new Address(receiver),
    gasPrice: new GasPrice(
      new BigNumber(gasPrice || defaultGasPrice).toNumber()
    ),
    gasLimit: new GasLimit(
      new BigNumber(gasLimit || defaultGasLimit).toNumber()
    ),
    data: new TransactionPayload(data),
    chainID: new ChainID(chainId),
    version: new TransactionVersion(
      new BigNumber(version || defaultVersion).toNumber()
    )
  });

  return transaction;
};

export default newTransaction;
