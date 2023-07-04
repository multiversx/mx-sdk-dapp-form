import { object, string } from 'yup';
import { TransactionTypeEnum } from 'types';
import data from './data';
import egldAmount from './egldAmount';
import egldGasLimit from './egldGasLimit';
import esdtAmount from './esdtAmount';
import esdtGasLimit from './esdtGasLimit';
import gasPrice from './gasPrice';
import nftAmount from './nftAmount';
import nftGasLimit from './nftGasLimit';
import receiver from './receiver';
import receiverUsername from './receiverUsername';

export const validationSchema = object().shape({
  receiver,
  tokenId: string().required('Required'),
  gasPrice,
  receiverUsername,
  data,
  amount: string().when(
    ['txType'],
    function amountValidation(txType: TransactionTypeEnum) {
      switch (txType) {
        case TransactionTypeEnum.ESDT:
          return esdtAmount;
        case TransactionTypeEnum.EGLD:
          return egldAmount;
        default:
          return nftAmount;
      }
    }
  ),
  gasLimit: string().when(
    ['txType'],
    function amountValidation(txType: TransactionTypeEnum) {
      switch (txType) {
        case TransactionTypeEnum.ESDT:
          return esdtGasLimit;
        case TransactionTypeEnum.EGLD:
          return egldGasLimit;
        default:
          return nftGasLimit;
      }
    }
  )
});

export default validationSchema;
