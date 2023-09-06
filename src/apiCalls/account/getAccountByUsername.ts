// import { trimUsernameDomain } from '@multiversx/sdk-dapp/hooks/account/helpers/trimUsernameDomain';
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
    const { request, data: account } = await axios.get<AccountContextPropsType>(
      `usernames/${username}`,
      config
    );

    if (!request?.responseURL) {
      return null;
    }

    // "https://api.multiversx.com/accounts/erd1..."
    const [, redirectAddress] = request.responseURL.split('/accounts/') ?? [];
    const address: string = redirectAddress ?? account.address;

    if (!addressIsValid(address)) {
      return null;
    }

    return account;
  } catch (error) {
    return null;
  }
}
