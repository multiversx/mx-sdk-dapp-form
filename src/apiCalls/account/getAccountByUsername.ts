import { trimUsernameDomain } from '@multiversx/sdk-dapp/hooks/account/helpers';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import axios from 'axios';

import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { AccountContextPropsType } from 'contexts/AccountContext';

export async function getAccountByUsername(
  username: string,
  apiConfig?: ApiConfigType
) {
  try {
    const config = apiConfig || (await getApiConfig());
    const { request, data } = await axios.get<AccountContextPropsType>(
      `usernames/${username}`,
      config
    );

    // "https://api.multiversx.com/accounts/erd1..."
    const [, redirectAddress] = request?.responseURL?.split('/accounts/') ?? [];
    const address = redirectAddress ?? data.address;

    if (!addressIsValid(address)) {
      return null;
    }

    return {
      address,
      username: trimUsernameDomain(String(data.username)) ?? ''
    };
  } catch (error) {
    return null;
  }
}
