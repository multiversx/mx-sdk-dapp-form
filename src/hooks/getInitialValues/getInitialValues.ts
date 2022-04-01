import { getIdentifierType } from 'validation';
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

  const computedNft = await getNft({ data, address, tokenId });

  const esdtToken = await getToken({ identifier: tokenId, address });

  const computedTokenId = esdtToken?.identifier || egldLabel;

  const { initGasLimit, initGasLimitError } = await getInitialGasLimit({
    ...props,
    computedTokenId
  });

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
    tokenFound: isEsdt && !esdtToken
  };

  return returnValues;
}

export default getInitialValues;
