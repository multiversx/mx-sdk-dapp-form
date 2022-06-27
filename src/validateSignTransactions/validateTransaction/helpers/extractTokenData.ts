import { TxsDataTokensType } from '@elrondnetwork/dapp-core/types';

export function extractTokenData(props: {
  dataId: string;
  egldLabel: string;
  txsDataTokens: TxsDataTokensType;
}) {
  const { txsDataTokens, dataId, egldLabel } = props;
  const extractedTokenData = txsDataTokens?.[dataId];

  const emptyTokenData = {
    tokenId: egldLabel,
    amount: '',
    type: '',
    nonce: '',
    receiver: ''
  };

  return extractedTokenData ? extractedTokenData : emptyTokenData;
}

export default extractTokenData;
