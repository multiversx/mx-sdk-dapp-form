import axios from 'axios';
import { ApiPropsType } from 'apiCalls/types';
import { NftType } from 'types';

export interface GetNftByAddressAndIdentifierArgsType {
  address: string;
  identifier: string;
}

export const getNftByAddressAndIdentifier =
  (props: ApiPropsType) =>
  async ({ address, identifier }: GetNftByAddressAndIdentifierArgsType) => {
    try {
      const { data }: { data: NftType } = await axios.get(
        `/accounts/${address}/nfts/${identifier}`,
        props
      );
      return data ? data : null;
    } catch (err) {
      return null;
    }
  };

export const getGlobalNftByIdentifier =
  (props: ApiPropsType) => async (identifier: string) => {
    try {
      const { data }: { data: NftType } = await axios.get(
        `/nfts/${identifier}`,
        props
      );
      return data ? data : null;
    } catch (err) {
      return null;
    }
  };
