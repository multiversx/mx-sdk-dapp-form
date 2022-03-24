import { useApiContext } from 'contexts/ApiContext';
import { checkScamAddress } from './addresses';
import { getEconomicsInfo } from './economics';
import {
  getToken,
  fetchTokens,
  fetchAllTokens,
  getNftByAddressAndIdentifier,
  getAccountToken,
  getGlobalNftByIdentifier,
  fetchMetaEsdts,
  fetchAllMetaEsdts
} from './tokens';
import { getTransactions, getTransactionCost } from './transactions';

export function useApiCalls() {
  const props = useApiContext();
  return {
    getTransactions: getTransactions(props),
    getToken: getToken(props),
    fetchTokens: fetchTokens(props),
    fetchAllTokens: fetchAllTokens(props),
    getAccountToken: getAccountToken(props),
    getNftByAddressAndIdentifier: getNftByAddressAndIdentifier(props),
    getGlobalNftByIdentifier: getGlobalNftByIdentifier(props),
    fetchMetaEsdts: fetchMetaEsdts(props),
    fetchAllMetaEsdts: fetchAllMetaEsdts(props),
    getEconomicsInfo: getEconomicsInfo(props),
    checkScamAddress: checkScamAddress(props),
    getTransactionCost: getTransactionCost(props)
  };
}
