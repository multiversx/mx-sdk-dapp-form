import { useEffect, useMemo } from 'react';
import { denominate } from '@elrondnetwork/dapp-core';
import {
  decimals,
  defaultGasPrice as configGasPrice,
  denomination
} from 'constants/index';
import { computeNftDataField } from 'operations';
import { FormConfigType, NftEnumType } from 'types';
import { useComputeNft, useComputeToken } from './';
import useComputeInitGasLimit from './useComputeInitGasLimit';

const nftDefaultAmount = '1';

interface UseGetInitialValuesType {
  configValues: FormConfigType;
  egldLabel: string;
  address: string;
}

export function useGetInitialValues(props: UseGetInitialValuesType) {
  const {
    configValues: { receiver, amount, gasPrice, data, tokenId, active },
    address,
    egldLabel
  } = props;

  const { searchNft, computedNft, getSearchParamNft, searchNftByIdentifier } =
    useComputeNft(address);

  const { nft } = computedNft;

  const { computedTokenId, computedTokens, tokenFound } = useComputeToken({
    formTokenId: tokenId,
    prefilledForm: Boolean(active),
    egldLabel
  });

  const { computeGasLimit, initGasLimit, initGasLimitError } =
    useComputeInitGasLimit();

  useEffect(() => {
    if (data) {
      // extract nft from dataField
      searchNft(data);
      return;
    }
    if (tokenId) {
      searchNftByIdentifier(tokenId);
      return;
    }
    getSearchParamNft();
  }, []);

  useEffect(() => {
    computeGasLimit(computedTokenId);
  }, [computedTokenId]);

  // formulate form initialValues
  const computedAmount = useMemo(() => {
    if (nft?.type === NftEnumType.NonFungibleESDT) {
      return nftDefaultAmount;
    }

    const isMetaESDT = nft?.type === NftEnumType.MetaESDT;

    const amountValue = computedNft?.quantity || amount;

    if (isMetaESDT && amountValue) {
      return denominate({
        input: amountValue,
        denomination: nft?.decimals,
        showLastNonZeroDecimal: true,
        addCommas: false,
        decimals
      });
    }
    return amountValue;
  }, [nft, amount, computedNft]);

  const calculatedGasPrice =
    gasPrice !== '0'
      ? gasPrice
      : denominate({
          input: String(configGasPrice),
          denomination,
          showLastNonZeroDecimal: true,
          decimals
        });

  const nftData = nft
    ? computeNftDataField({
        nft,
        amount: amount,
        receiver,
        errors: false
      })
    : '';

  const initData = data ? data : nftData;

  const initialValues = {
    receiver,
    amount: computedAmount,
    tokenId: String(computedTokenId),
    gasLimit: initGasLimit,
    gasPrice: calculatedGasPrice,
    data: initData
  };

  return {
    initialValues,
    nft: computedNft.nft,
    searchingNft: computedNft.computed == null,
    gasLimitCostError: initGasLimitError,
    gasLimitCost: initGasLimit,
    computedTokens,
    tokenFound,
    searchingToken: tokenFound == null,
    computedTokenId
  };
}

export default useGetInitialValues;
