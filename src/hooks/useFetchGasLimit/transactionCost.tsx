import axios from 'axios';
import { getApiConfig } from 'apiCalls';

export async function getTransactionCost(transaction: { [key: string]: any }) {
  try {
    const { data } = await axios.post<{
      data?: {
        txGasUnits: number;
        returnMessage: string;
      };
      code: string;
    }>('/transaction/cost', transaction, getApiConfig());

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
