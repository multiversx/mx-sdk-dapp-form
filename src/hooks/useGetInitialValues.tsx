import { useEffect, useMemo, useState } from 'react';
import { denominate } from '@elrondnetwork/dapp-core';
import { getDelegationDataForChainId } from 'apiCalls';
import {
  decimals,
  defaultGasPrice as configGasPrice,
  denomination
} from 'constants/index';
import { computeInitGasLimit } from 'operations';
import { computeNftDataField } from 'operations/computeDataField';
import { FormConfigType, NftEnumType } from 'types';
import useComputeNft from './useComputeNft';
import useComputeToken from './useComputeToken';

const nftDefaultAmount = '1';

interface UseGetInitialValuesType {
  configValues: FormConfigType;
  address: string;
  balance: string;
  egldLabel: string;
  nonce: number;
  chainId: string;
}

export function useGetInitialValues(props: UseGetInitialValuesType) {
  const {
    address,
    chainId,
    balance,
    egldLabel,
    nonce,
    configValues: {
      receiver,
      amount,
      gasPrice,
      gasLimit,
      data,
      tokenId,
      active
    }
  } = props;

  const { searchNft, computedNft, getSearchParamNft, searchNftByIdentifier } =
    useComputeNft(address);

  const { nft } = computedNft;

  const [initGasLimit, setInitGasLimit] = useState('');
  const [initGasLimitError, setInitGasLimitError] = useState<string | null>(
    null
  );

  const { computedTokenId, computedTokens, tokenFound } = useComputeToken({
    formTokenId: tokenId,
    prefilledForm: Boolean(active),
    address,
    egldLabel
  });

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

  async function computeGasLimit(computedTokenId: string) {
    const delegationContractData = await getDelegationDataForChainId(chainId);

    const computeGasLimitProps = {
      receiver,
      isInternal: ['1', 'T'].includes(chainId),
      balance,
      address,
      nonce,
      amount,
      data,
      gasLimit,
      gasPrice,
      delegationContractData,
      chainId,
      egldLabel,
      computedTokenId
    };
    const { initGasLimit, initGasLimitError } = await computeInitGasLimit(
      computeGasLimitProps
    );
    setInitGasLimit(initGasLimit);
    setInitGasLimitError(initGasLimitError);
  }

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
