import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  JSXElementConstructor
} from 'react';
import { useFormikContext } from 'formik';
import uniqBy from 'lodash/uniqBy';
import { fetchAllTokens } from 'apiCalls';
import { useAccountContext } from 'contexts/AccountContext';
import { getTokenDetails, getTxType } from 'operations';
import {
  ExtendedValuesType,
  PartialMetaEsdtType,
  PartialNftType,
  PartialTokenType,
  TransactionTypeEnum
} from 'types';

import { useFormContext } from '../FormContext';
import { useNetworkConfigContext } from '../NetworkContext';
import { getAllowedReceiversData, useGetEconomicsInfo } from './utils';

export interface TokensContextInitializationPropsType {
  EgldIcon?: JSXElementConstructor<any>;
  initialNft?: PartialNftType;
  initialTokens?: PartialTokenType[] | null;
}

export interface TokensContextPropsType {
  tokenId: string;
  isTokenIdInvalid: boolean;
  digits: number;
  egldLabel: string;
  EgldIcon?: JSXElementConstructor<any>;
  egldPriceInUsd: number;
  tokenIdError?: string;
  areTokensLoading: boolean;
  tokenDetails: PartialTokenType;
  tokens: PartialTokenType[];
  allAvailableTokens: PartialTokenType[];
  nft?: PartialNftType;
  getTokens: (showLoading?: boolean) => void;
  onChangeTokenId: (value: string) => void;
}

interface TokensContextProviderPropsType {
  children: any;
  value?: TokensContextInitializationPropsType;
}

export const TokensContext = createContext({} as TokensContextPropsType);

const tokenIdField = 'tokenId';
const nftField = 'nft';
const tokensField = 'tokens';
const txTypeField = 'txType';

let previouslyFetchedTokens: PartialTokenType[] = [];

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
    networkConfig: { decimals }
  } = useNetworkConfigContext();
  const fetchigRef = useRef(false);
  const { egldPriceInUsd, digits, egldLabel } = useGetEconomicsInfo();

  const esdtTokens = tokens || previouslyFetchedTokens;

  const handleGetTokens = useCallback(
    async (showLoading = true) => {
      setAreTokensLoading(showLoading);

      // fetching in progress
      if (fetchigRef.current) {
        return;
      }

      fetchigRef.current = true;

      const newTokensAndMetaESDTs = await fetchAllTokens(address);
      const currentTokens = tokens ?? [];
      const tokensFromServer = uniqBy(
        [...currentTokens, ...newTokensAndMetaESDTs],
        (token) => token.identifier
      );

      setFieldValue(tokensField, tokensFromServer);
      previouslyFetchedTokens = tokensFromServer;
      fetchigRef.current = false;
      setAreTokensLoading(false);
    },
    [address]
  );

  const handleChangeTokenId = useCallback((newValue: string) => {
    setFieldValue(tokenIdField, newValue, false);
  }, []);

  useEffect(() => {
    const showLoading = false;
    handleGetTokens(showLoading);
    return () => {
      previouslyFetchedTokens = [];
    };
  }, []);

  const setNftField = async () => {
    const newTxType = getTxType({ nft, tokenId });
    setFieldValue(txTypeField, newTxType);

    if (
      newTxType === TransactionTypeEnum.SemiFungibleESDT ||
      newTxType === TransactionTypeEnum.NonFungibleESDT
    ) {
      return;
    }

    const selectedNft =
      allAvailableTokens?.find((token) => token.identifier === tokenId) || nft;

    if (newTxType === TransactionTypeEnum.MetaESDT && selectedNft) {
      // casting is allowed because we know it's a MetaESDT
      let newNft = selectedNft as PartialMetaEsdtType;

      // allow synchroneus change of nft in dropdown and fill in async data later
      setFieldValue(nftField, newNft);

      const allowedReceivers = await getAllowedReceiversData(newNft);

      newNft = {
        ...newNft,
        allowedReceivers
      };

      setFieldValue(nftField, newNft);
    } else {
      setFieldValue(nftField, undefined);
    }
  };

  const isTokenIdInvalid = checkInvalid(tokenIdField);

  const allAvailableTokens: Array<
    PartialTokenType & {
      usdPrice?: number;
    }
  > = [
    {
      name: 'MultiversX eGold',
      identifier: egldLabel,
      balance: balance,
      decimals: Number(decimals),
      ticker: egldLabel,
      usdPrice: egldPriceInUsd
    },
    ...esdtTokens
  ];

  useEffect(() => {
    setNftField();
  }, [tokenId]);

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
        EgldIcon: value?.EgldIcon,
        egldPriceInUsd,
        digits,
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
