import { getIdentifierType } from '@multiversx/sdk-dapp/out/utils/validation/getIdentifierType';
import { ApiConfigType, getAccountToken } from 'apiCalls';

async function getSingleToken(
  props: { identifier: string; address: string },
  apiConfig?: ApiConfigType
) {
  const { address, identifier } = props;
  try {
    const response = await getAccountToken(
      { address, token: identifier },
      apiConfig
    );

    if (!response) {
      return null;
    }

    return response.data;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function getToken(props: { identifier?: string; address: string }) {
  const { identifier, address } = props;
  const { isEsdt } = getIdentifierType(identifier);

  if (identifier && isEsdt) {
    return getSingleToken({ address, identifier });
  }

  return null;
}
