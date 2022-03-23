import axios from 'axios';
import { timeout } from 'config';
import { getBaseURL } from '../../../../../../apiRequests/helpers';

export async function getTransactionCost(transaction: { [key: string]: any }) {
  try {
    const { data } = await axios.post<{
      data?: {
        txGasUnits: number;
        returnMessage: string;
      };
      code: string;
    }>('/transaction/cost', transaction, {
      baseURL: getBaseURL(),
      timeout
    });

    return {
      data,
      success: true
    };
  } catch (err) {
    console.error(err);
    return {
      success: false
    };
  }
}

export default getTransactionCost;
