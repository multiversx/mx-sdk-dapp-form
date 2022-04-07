import axios from 'axios';
import { AccountContextPropsType } from '../../contexts';

export async function getElrondAccount(address: string, apiAddress: string) {
  try {
    const { data } = await axios.get<AccountContextPropsType>(
      `${apiAddress}/accounts/${address}`
    );
    if (data != null) {
      return data;
    }
  } catch (err) {
    console.error('error fetching elrond account');
  }
  return null;
}
