import axios from 'axios';
import { getApiConfig } from '../helpers';

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

export async function getEconomicsInfo(): Promise<EconomicsInfoType | null> {
  try {
    const response = await axios.get('economics', getApiConfig());
    return response.data;
  } catch (err) {
    console.error('err fetching economics info', err);
    return null;
  }
}
