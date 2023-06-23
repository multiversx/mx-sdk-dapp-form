import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';

export async function getAccountByUsername(
  username: string,
  apiConfig?: ApiConfigType
) {
  const config = apiConfig || (await getApiConfig());
  const { request } = await axios.get(`usernames/${username}`, config);

  // "https://api.multiversx.com/accounts/erd1..."
  const [, address] = request?.responseURL?.split('/accounts/') ?? [];
  return addressIsValid(address) ? address : '';
}
