import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useFormikContext } from 'formik';
import { fetchAllMetaEsdts, fetchAllTokens } from 'apiCalls';
import { useAccountContext } from 'contexts/AccountContext';
import {
  getTokenDetails,
  GetTokenDetailsReturnType,
  getTxType
} from 'operations';
import { ExtendedValuesType, NftType, TokenType, TxTypeEnum } from 'types';

import { useFormContext } from '../FormContext';
import { useNetworkConfigContext } from '../NetworkContext';
import { useGetEconomicsInfo } from './utils';

export interface TokensContextInitializationPropsType {
  initialNft?: NftType;
  initialTokens?: TokenType[] | null;
}

export interface TokensContextPropsType {
  tokenId: string;
  isTokenIdInvalid: boolean;
  decimals: number;
  egldLabel: string;
  egldPriceInUsd: number;
  tokenIdError?: string;
  areTokensLoading: boolean;
  tokenDetails: GetTokenDetailsReturnType;
  tokens: TokenType[];
  allAvailableTokens: TokenType[];
  nft?: NftType;
  getTokens: () => void;
  onChangeTokenId: (value: string) => void;
}
interface TokensContextProviderPropsType {
  children: any;
  value?: TokensContextInitializationPropsType;
}

export const TokensContext = React.createContext({} as TokensContextPropsType);

const tokenIdField = 'tokenId';
const nftField = 'nft';
const tokensField = 'tokens';
const txTypeField = 'txType';

let previouslyFetchedTokens: TokenType[] = [];

export function TokensContextProvider({
  children,
  value
}: TokensContextProviderPropsType) {
  const [areTokensLoading, setAreTokensLoading] = useState(true);
  const {
    values: { tokenId, tokens, nft },
    errors: { tokenId: tokenIdError },
    setFieldValue
  } = useFormikContext<ExtendedValuesType>();
  const { address, balance } = useAccountContext();
  const { checkInvalid } = useFormContext();
  const {
    networkConfig: { egldDenomination }
  } = useNetworkConfigContext();
  const { egldPriceInUsd, decimals, egldLabel } = useGetEconomicsInfo();

  const esdtTokens = tokens || previouslyFetchedTokens;

  const handleGetTokens = useCallback(async () => {
    setAreTokensLoading(true);
    const newTokens = await fetchAllTokens(address);
    const newMetaEsdts = await fetchAllMetaEsdts(address);
    const tokensFromServer = [...newTokens, ...newMetaEsdts];
    setFieldValue(tokensField, tokensFromServer);
    previouslyFetchedTokens = tokensFromServer;
    setAreTokensLoading(false);
  }, [address]);

  const handleChangeTokenId = useCallback((newValue: string) => {
    setFieldValue(tokenIdField, newValue, false);
  }, []);

  useEffect(() => {
    handleGetTokens();
  }, []);

  useEffect(() => {
    const newTxType = getTxType({ nft, tokenId });
    setFieldValue(txTypeField, newTxType);
    if (newTxType === TxTypeEnum.MetaESDT) {
      const selectedNft = tokens?.find((token) => token.identifier === tokenId);
      setFieldValue(nftField, selectedNft as NftType);
    } else {
      setFieldValue(nftField, undefined);
    }
  }, [tokenId]);

  const isTokenIdInvalid = checkInvalid(tokenIdField);

  const allAvailableTokens: TokenType[] = [
    {
      name: 'Elrond eGold',
      identifier: egldLabel,
      balance: balance,
      decimals: Number(egldDenomination),
      ticker: egldLabel
    },
    ...esdtTokens
  ];

  const tokenDetails = useMemo(() => {
    return getTokenDetails({
      tokens: allAvailableTokens || [],
      tokenId
    });
  }, [tokenId, tokens]);

  return (
    <TokensContext.Provider
      value={{
        nft: nft || value?.initialNft,
        tokens: esdtTokens,
        allAvailableTokens,
        //this will be true on first run,
        //but false when the tokens will be revalidated in the background
        areTokensLoading: areTokensLoading && esdtTokens.length === 0,
        tokenIdError,
        tokenId,
        tokenDetails,
        egldLabel,
        egldPriceInUsd,
        decimals,
        isTokenIdInvalid,
        getTokens: handleGetTokens,
        onChangeTokenId: handleChangeTokenId
      }}
    >
      {children}
    </TokensContext.Provider>
  );
}

export function useTokensContext() {
  return useContext(TokensContext);
}
