import { ApiConfigType, getNftByAddressAndIdentifier } from 'apiCalls';
import { getIdentifierType } from 'validation';

export async function searchNftByIdentifier(
  props: { identifier: string; address: string },
  apiConfig?: ApiConfigType
) {
  const { address, identifier } = props;
  const { isNft } = getIdentifierType(identifier);
  if (!isNft) {
    return null;
  }
  try {
    const nft = await getNftByAddressAndIdentifier(
      {
        address,
        identifier
      },
      apiConfig
    );
    return nft;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function getSearchParamNft(address: string) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const searchParams = Object.fromEntries(urlSearchParams);
  const { isNft } = getIdentifierType(searchParams?.token);

  if (!isNft) {
    return null;
  }

  return searchNftByIdentifier({ identifier: searchParams.token, address });
}
