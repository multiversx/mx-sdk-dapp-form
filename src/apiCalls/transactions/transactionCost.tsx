import axios from 'axios';
import { getApiConfig } from 'apiCalls/apiConfig';

export async function getTransactionCost(transaction: { [key: string]: any }) {
  try {
    const apiConfig = await getApiConfig();

    if (!apiConfig) {
      return {
        success: false
      };
    }

    const { data } = await axios.post<{
      data?: {
        txGasUnits: number;
        returnMessage: string;
      };
      code: string;
    }>('/transaction/cost', transaction, apiConfig);

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
