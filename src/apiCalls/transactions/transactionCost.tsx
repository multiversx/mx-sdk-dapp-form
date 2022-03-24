import axios from 'axios';
import { ApiPropsType } from 'apiCalls/types';

export const getTransactionCost =
  (props: ApiPropsType) => async (transaction: { [key: string]: any }) => {
    try {
      const { data } = await axios.post<{
        data?: {
          txGasUnits: number;
          returnMessage: string;
        };
        code: string;
      }>('/transaction/cost', transaction, props);

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
  };

export default getTransactionCost;
