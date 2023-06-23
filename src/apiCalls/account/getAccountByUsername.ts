import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';
import { AccountContextPropsType } from '../../contexts';

export async function getAccountByUsername(
  username: string,
  apiConfig?: ApiConfigType
) {
  const config = apiConfig || (await getApiConfig());
  const { data } = await axios.get<AccountContextPropsType>(
    `usernames/${username}`,
    config
  );
  return data;
}
