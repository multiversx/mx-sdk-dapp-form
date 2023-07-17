import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { AccountContextPropsType } from 'contexts/AccountContext';

export async function getAccountByUsername(
  username: string,
  apiConfig?: ApiConfigType
) {
  const config = apiConfig || (await getApiConfig());
  const { request, data } = await axios.get<AccountContextPropsType>(
    `usernames/${username}`,
    config
  );

  // "https://api.multiversx.com/accounts/erd1..."
  const [, address] = request?.responseURL?.split('/accounts/') ?? [];

  if (!addressIsValid(address)) {
    return null;
  }

  return {
    address: data.address,
    username: String(data.username)
  };
}
