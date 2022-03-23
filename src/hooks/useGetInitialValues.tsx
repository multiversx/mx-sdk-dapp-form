import { useEffect, useMemo } from 'react';
import { denominate } from '@elrondnetwork/dapp-core';
import { decimals, gasPrice as configGasPrice, denomination } from 'config';
import { useComputeNft, useComputeToken } from 'logic/hooks';
import { computeNftDataField } from 'logic/operations';
import { useSelector } from 'react-redux';
import { formSelector } from 'redux/selectors';
import useComputeInitGasLimit from 'hooks/useComputeInitGasLimit';
import { NftEnumType } from 'types';

const nftDefaultAmount = '1';

export function useGetInitialValues() {
  // TODO: return maiar standard transaction string

  const { receiver, amount, gasPrice, data, tokenId } =
    useSelector(formSelector);

  const { searchNft, computedNft, getSearchParamNft, searchNftByIdentifier } =
    useComputeNft();

  const { nft } = computedNft;

  const { computedTokenId, computedTokens, tokenFound } = useComputeToken();

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
          input: configGasPrice,
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
