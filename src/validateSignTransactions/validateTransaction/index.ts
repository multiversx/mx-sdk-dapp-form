import { getTxType } from 'operations';
import { ExtendedValuesType } from 'types';
import { defaultErrorMessages } from 'validation/defaultErrorMessages';
import { getValidationSchema } from 'validationSchema';
import {
  extractTokenData,
  fetchNft,
  getDataToken,
  getDataTokenId,
  getValues
} from './helpers';

import { ValidateType } from './types';

export const validateTransaction = async ({
  tx,
  txsDataTokens,
  egldLabel,
  address,
  balance,
  chainId,
  ledger,
  apiConfig
}: ValidateType) => {
  const txData = tx.transaction.getData().toString();
  const dataId = String(txData || tx.multiTxData);

  const { amount, tokenId, type, receiver, nonce } = extractTokenData({
    txsDataTokens,
    dataId,
    egldLabel
  });

  const computedNft = await fetchNft(
    {
      type: String(type),
      nonce: String(nonce),
      address,
      amount,
      receiver,
      tokenId,
      data: txData
    },
    apiConfig
  );

  const dataTokenId = getDataTokenId({
    type,
    egldLabel,
    tokenId,
    nftFound: Boolean(computedNft)
  });

  const { tokenData, tokenAmount, tokenFound } = await getDataToken(
    {
      tokenId: dataTokenId,
      parsedTokenAmount: amount
    },
    apiConfig
  );

  const values = getValues({ tx, tokenId, egldLabel, tokenFound, tokenAmount });

  let errors = {};

  try {
    const allValues: ExtendedValuesType = {
      ...values,
      txType: getTxType({ nft: computedNft?.nft, tokenId }),
      address,
      balance,
      chainId,
      ignoreTokenBalance: true,
      nft: computedNft?.nft,
      tokens: tokenData ? [tokenData] : [],
      ledger
    };
    getValidationSchema(defaultErrorMessages).validateSync(allValues);
  } catch ({ path, message }) {
    errors = {
      [String(path)]: String(message)
    };
  }

  return errors;
};

export default validateTransaction;

export * from './types';
