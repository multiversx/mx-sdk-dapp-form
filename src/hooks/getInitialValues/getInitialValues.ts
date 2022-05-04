import { getIdentifierType } from '@elrondnetwork/dapp-core';
import getInitialAmount from './getInitialAmount';
import { getInitialData } from './getInitialData';
import getInitialGasLimit from './getInitialGasLimit';
import getInitialGasPrice from './getInitialGasPrice';
import getNft from './getNft';
import { getToken } from './getToken';
import { GetInitialValuesType } from './types';

export async function getInitialValues(props: GetInitialValuesType) {
  const {
    address,
    egldLabel,
    configValues: { receiver, amount, gasPrice, data, tokenId }
  } = props;

  const computedTokenId = tokenId || egldLabel;

  const [computedNft, esdtToken, gasData] = await Promise.all([
    getNft({ data, address, tokenId }),
    getToken({ identifier: tokenId, address }),
    getInitialGasLimit({
      ...props,
      computedTokenId
    })
  ]);

  const { initGasLimit, initGasLimitError } = gasData;

  const initialValues = {
    receiver,
    amount: getInitialAmount({ computedNft, amount }),
    tokenId: computedTokenId,
    gasLimit: initGasLimit,
    gasPrice: getInitialGasPrice(gasPrice),
    data: getInitialData({ computedNft, data, receiver, amount })
  };

  const { isEsdt } = getIdentifierType(computedTokenId);

  const returnValues = {
    initialValues,
    nft: computedNft?.nft,
    gasLimitCostError: initGasLimitError,
    computedTokens: esdtToken ? [esdtToken] : [],
    computedTokenId,
    tokenFound: isEsdt ? Boolean(esdtToken) : true
  };

  return returnValues;
}

export default getInitialValues;
