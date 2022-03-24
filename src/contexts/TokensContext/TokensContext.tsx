import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useApiCalls } from 'apiCalls';
import { useAccountContext } from 'contexts/AccountContext';
import {
  getTokenDetails,
  GetTokenDetailsReturnType,
  getTxType
} from 'operations';
import { ExtendedValuesType, NftType, TokenType, TxTypeEnum } from 'types';

import { useFormContext } from '../FormContext';
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
  tokenDetails: GetTokenDetailsReturnType;
  tokens: TokenType[];
  nft?: NftType;
  getTokens: () => void;
  onChangeTokenId: (value: string) => void;
}
interface TokensContextProviderPropsType {
  children: any;
  value: TokensContextInitializationPropsType;
}

export const TokensContext = React.createContext({} as TokensContextPropsType);

const tokenIdField = 'tokenId';
const nftField = 'nft';
const tokensField = 'tokens';
const txTypeField = 'txType';

export function TokensContextProvider({
  children,
  value
}: TokensContextProviderPropsType) {
  const {
    values: { tokenId, tokens, nft },
    errors: { tokenId: tokenIdError },
    setFieldValue
  } = useFormikContext<ExtendedValuesType>();
  const { address } = useAccountContext();
  const { checkInvalid } = useFormContext();
  const { egldLabel, egldPriceInUsd, decimals } = useGetEconomicsInfo();
  const { fetchAllTokens, fetchAllMetaEsdts } = useApiCalls();

  const handleGetTokens = useCallback(async () => {
    const newTokens = await fetchAllTokens(address);
    const newMetaEsdts = await fetchAllMetaEsdts(address);
    setFieldValue(tokensField, [...newTokens, ...newMetaEsdts]);
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

  const tokenDetails = useMemo(() => {
    return getTokenDetails({
      tokens: tokens || [],
      tokenId
    });
  }, [tokenId, tokens]);

  return (
    <TokensContext.Provider
      value={{
        nft: nft || value.initialNft,
        tokens: tokens || value.initialTokens || [],
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
