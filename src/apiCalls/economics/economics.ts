import axios from 'axios';
import { getApiConfig } from 'apiCalls/apiConfig';

export interface EconomicsInfoType {
  totalSupply: number;
  circulatingSupply: number;
  staked: number;
  price: number;
  marketCap: number;
  apr: number;
  topUpApr: number;
  baseApr: number;
}

export async function getEconomicsInfo() {
  try {
    const apiConfig = await getApiConfig();
    const { data } = await axios.get<EconomicsInfoType>('economics', apiConfig);
    return data;
  } catch (err) {
    console.error('err fetching economics info', err);
    return null;
  }
}
