import { getIdentifierType } from '@elrondnetwork/dapp-core/utils';
import { setApiConfig } from 'apiCalls';
import getInitialAmount from './getInitialAmount';
import { getInitialData } from './getInitialData';
import getInitialGasLimit from './getInitialGasLimit';
import getInitialGasPrice from './getInitialGasPrice';
import getNft from './getNft';
import { getToken } from './getToken';
import { GetInitialValuesType } from './types';

function getSearchParamTokenId() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const searchParams = Object.fromEntries(urlSearchParams);
  const searchParamTokenId = searchParams.token;
  return searchParamTokenId;
}

export async function getInitialValues(props: GetInitialValuesType) {
  const {
    address,
    egldLabel,
    configValues: { receiver, amount, gasPrice, data, tokenId: configTokenId },
    networkConfig
  } = props;

  const searchParamTokenId = getSearchParamTokenId();
  const identifier = configTokenId || searchParamTokenId;

  const computedTokenId = identifier || egldLabel;

  if (networkConfig) {
    setApiConfig(networkConfig);
  }

  const [computedNft, esdtToken, gasData] = await Promise.all([
    getNft({ data, address, identifier }),
    getToken({ identifier, address }),
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

  const { isEsdt } = getIdentifierType(identifier);

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
