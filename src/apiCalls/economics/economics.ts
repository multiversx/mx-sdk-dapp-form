import axios from 'axios';
import { ApiPropsType } from 'apiCalls/types';

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

export const getEconomicsInfo = (props: ApiPropsType) => async () => {
  try {
    const { data } = await axios.get<EconomicsInfoType>('economics', props);
    return data;
  } catch (err) {
    console.error('err fetching economics info', err);
    return null;
  }
};
