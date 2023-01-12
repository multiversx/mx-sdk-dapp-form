import { TransactionsDataTokensType } from '@multiversx/sdk-dapp/types/transactions.types';

export function extractTokenData(props: {
  dataId: string;
  egldLabel: string;
  txsDataTokens: TransactionsDataTokensType;
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
