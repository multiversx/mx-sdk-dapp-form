import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useFormikContext } from 'formik';
import uniqBy from 'lodash/uniqBy';
import { fetchAllMetaEsdts, fetchAllTokens } from 'apiCalls';
import { useAccountContext } from 'contexts/AccountContext';
import { ComputedNftType } from 'hooks';
import { getTokenDetails, getTxType } from 'operations';
import {
  ExtendedValuesType,
  PartialNftType,
  PartialTokenType,
  TransactionTypeEnum
} from 'types';

import { useFormContext } from '../FormContext';
import { useNetworkConfigContext } from '../NetworkContext';
import { useGetEconomicsInfo } from './utils';

export interface TokensContextInitializationPropsType {
  initialNft?: PartialNftType;
  allowedReceivers?: ComputedNftType['allowedReceivers'];
  initialTokens?: PartialTokenType[] | null;
}

export interface TokensContextPropsType {
  tokenId: string;
  isTokenIdInvalid: boolean;
  digits: number;
  egldLabel: string;
  egldPriceInUsd: number;
  tokenIdError?: string;
  areTokensLoading: boolean;
  tokenDetails: PartialTokenType;
  tokens: PartialTokenType[];
  allAvailableTokens: PartialTokenType[];
  nft?: PartialNftType;
  allowedReceivers?: ComputedNftType['allowedReceivers'];
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
  const { egldPriceInUsd, digits, egldLabel } = useGetEconomicsInfo();

  const esdtTokens = tokens || previouslyFetchedTokens;

  const handleGetTokens = useCallback(async () => {
    setAreTokensLoading(true);
    const newTokens = await fetchAllTokens(address);
    const newMetaEsdts = await fetchAllMetaEsdts(address);
    const currentTokens = tokens ?? [];
    const tokensFromServer = uniqBy(
      [...currentTokens, ...newTokens, ...newMetaEsdts],
      (token) => token.identifier
    );

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

    if (
      newTxType === TransactionTypeEnum.SemiFungibleESDT ||
      newTxType === TransactionTypeEnum.NonFungibleESDT
    ) {
      return;
    }

    if (newTxType === TransactionTypeEnum.MetaESDT) {
      const selectedNft = allAvailableTokens?.find(
        (token) => token.identifier === tokenId
      );
      setFieldValue(nftField, selectedNft as PartialNftType);
    } else {
      setFieldValue(nftField, undefined);
    }
  }, [tokenId]);

  const isTokenIdInvalid = checkInvalid(tokenIdField);

  const allAvailableTokens: PartialTokenType[] = [
    {
      name: 'Elrond eGold',
      identifier: egldLabel,
      balance: balance,
      decimals: Number(decimals),
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
        allowedReceivers: value?.allowedReceivers,
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
