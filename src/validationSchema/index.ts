import { object, string } from 'yup';
import { TxTypeEnum } from 'types';
import data from './data';
import egldAmount from './egldAmount';
import egldGasLimit from './egldGasLimit';
import esdtAmount from './esdtAmount';
import esdtGasLimit from './esdtGasLimit';
import gasPrice from './gasPrice';
import nftAmount from './nftAmount';
import nftGasLimit from './nftGasLimit';
import receiver from './receiver';

export const validationSchema = object().shape({
  receiver,
  tokenId: string().required('Required'),
  gasPrice,
  data,
  amount: string().when(
    ['txType'],
    function amountValidation(txType: TxTypeEnum) {
      switch (txType) {
        case TxTypeEnum.ESDT:
          return esdtAmount;
        case TxTypeEnum.EGLD:
          return egldAmount;
        default:
          return nftAmount;
      }
    }
  ),
  gasLimit: string().when(
    ['txType'],
    function amountValidation(txType: TxTypeEnum) {
      switch (txType) {
        case TxTypeEnum.ESDT:
          return esdtGasLimit;
        case TxTypeEnum.EGLD:
          return egldGasLimit;
        default:
          return nftGasLimit;
      }
    }
  )
});

export default validationSchema;
