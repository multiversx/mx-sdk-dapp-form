import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs';

import BigNumber from 'bignumber.js';
import extractNftFromData from 'components/Nft/extractNftFromData';
import { useLocation } from 'react-router-dom';
import {
  getGlobalNftByIdentifier,
  getNftByAddressAndIdentifier
} from 'apiCalls';
import getIdentifierType from 'logic/validation/getIdentifierType';
import { NftType } from 'types';

export interface ComputedNftType {
  quantity?: string;
  receiver?: string;
  nft?: NftType;
  computed?: boolean;
}

interface ExistingNftType {
  collection: string;
  nonce: string;
  quantity: string;
  receiver: string;
}

export function useComputeNft() {
  const { search } = useLocation();
  const { address } = useGetAccountInfo();

  const [computedNft, setComputedNft] = React.useState<ComputedNftType>({});

  async function searchdNftById(identifier: string) {
    try {
      return await getNftByAddressAndIdentifier({
        address,
        identifier
      });
    } catch {
      return await getGlobalNftByIdentifier(identifier);
    }
  }

  async function searchNft(data: string, nft?: ExistingNftType) {
    if (computedNft.computed == null) {
      const extractedNft = extractNftFromData(data, nft);
      try {
        if (extractedNft) {
          const { collection, nonce, quantity, receiver } = extractedNft;
          const identifier = `${collection}-${nonce}`;
          const apiNft = await searchdNftById(identifier);
          if (apiNft) {
            setComputedNft({
              receiver: new Address(receiver).bech32(),
              nft: apiNft,
              quantity: nft
                ? quantity
                : new BigNumber(quantity, 16).toString(10),
              computed: true
            });
            return;
          }
        }

        setComputedNft((existing) => ({ ...existing, computed: true }));
      } catch (e) {
        console.log(e);
        setComputedNft((existing) => ({ ...existing, computed: true }));
      }
    }
  }

  async function searchNftByIdentifier(identifier: string) {
    const { isNft } = getIdentifierType(identifier);
    if (!isNft) {
      setComputedNft((existing) => ({ ...existing, computed: true }));
      return;
    }
    try {
      const data = await getNftByAddressAndIdentifier({
        address,
        identifier
      });
      if (data) {
        setComputedNft({
          nft: data,
          computed: true
        });
        return;
      }
    } catch (e) {
      console.log(e);
    }
    setComputedNft((existing) => ({ ...existing, computed: true }));
  }

  async function getSearchParamNft() {
    const urlSearchParams = new URLSearchParams(search);
    const searchParams = Object.fromEntries(urlSearchParams);
    const { isNft } = getIdentifierType(searchParams?.token);

    if (!isNft) {
      setComputedNft((existing) => ({ ...existing, computed: true }));
      return;
    }

    searchNftByIdentifier(searchParams.token);
  }

  return { computedNft, searchNft, getSearchParamNft, searchNftByIdentifier };
}

export default useComputeNft;
