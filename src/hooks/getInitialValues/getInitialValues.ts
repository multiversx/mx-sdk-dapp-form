import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import { setApiConfig } from 'apiCalls';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { PartialNftType, PartialTokenType } from 'types';
import { getInitialAmount } from './getInitialAmount';
import { getInitialData } from './getInitialData';
import { getInitialGasLimit } from './getInitialGasLimit';
import { getInitialGasPrice } from './getInitialGasPrice';
import { getNft } from './getNft';
import { getToken } from './getToken';
import { GetInitialValuesType } from './types';

function getSearchParamTokenId() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const searchParams = Object.fromEntries(urlSearchParams);
  const searchParamTokenId = searchParams.token;
  return searchParamTokenId;
}

export interface GetInitialValuesReturnType {
  initialValues: {
    receiver: string;
    receiverUsername?: string;
    amount: string;
    tokenId: string;
    gasLimit: string;
    gasPrice: string;
    data: string;
  };
  nft?: PartialNftType;
  gasLimitCostError?: SendFormContainerPropsType['initGasLimitError'];
  computedTokens: PartialTokenType[];
  computedTokenId: string;
  tokenFound: boolean;
}

export async function getInitialValues(
  props: GetInitialValuesType
): Promise<GetInitialValuesReturnType> {
  const {
    address,
    egldLabel,
    configValues: {
      receiver,
      receiverUsername,
      amount,
      gasPrice,
      data,
      tokenId: configTokenId
    },
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

  const initialValues: GetInitialValuesReturnType['initialValues'] = {
    receiver,
    receiverUsername,
    amount: getInitialAmount({ computedNft, amount }),
    tokenId: computedTokenId,
    gasLimit: initGasLimit,
    gasPrice: getInitialGasPrice(gasPrice),
    data: getInitialData({ computedNft, data, receiver, amount })
  };

  const { isEsdt } = getIdentifierType(identifier);

  const returnValues: GetInitialValuesReturnType = {
    initialValues,
    nft: computedNft?.nft,
    gasLimitCostError: initGasLimitError,
    computedTokens: esdtToken ? [esdtToken] : [],
    computedTokenId,
    tokenFound: isEsdt ? Boolean(esdtToken) : true
  };

  return returnValues;
}
