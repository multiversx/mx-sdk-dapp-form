import { ApiConfigType, getAccountToken } from 'apiCalls';
import { getIdentifierType } from 'validation';

async function getSingleToken(
  props: { identifier: string; address: string },
  apiConfig?: ApiConfigType
) {
  const { address, identifier } = props;
  try {
    const { data: token } = await getAccountToken(
      { address, token: identifier },
      apiConfig
    );
    return token;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function getToken(props: { identifier?: string; address: string }) {
  const { identifier, address } = props;
  const { isEsdt } = getIdentifierType(identifier);

  if (isEsdt && identifier) {
    return getSingleToken({ address, identifier });
  }

  return null;
}
