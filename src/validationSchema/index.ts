import { object, string } from 'yup';
import { TransactionTypeEnum } from 'types';
import { ValidationErrorMessagesType } from '../types/validation';
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

export const getValidationSchema = (
  errorMessages: ValidationErrorMessagesType
) =>
  object().shape({
    receiver: receiver(errorMessages),
    receiverUsername,
    tokenId: string().required('Required'),
    gasPrice: gasPrice(errorMessages),
    data,
    amount: string().when(
      ['txType'],
      function amountValidation(txType: TransactionTypeEnum) {
        switch (txType) {
          case TransactionTypeEnum.ESDT:
            return esdtAmount(errorMessages);
          case TransactionTypeEnum.EGLD:
            return egldAmount(errorMessages);
          default:
            return nftAmount(errorMessages);
        }
      }
    ),
    gasLimit: string().when(
      ['txType'],
      function amountValidation(txType: TransactionTypeEnum) {
        switch (txType) {
          case TransactionTypeEnum.ESDT:
            return esdtGasLimit(errorMessages);
          case TransactionTypeEnum.EGLD:
            return egldGasLimit(errorMessages);
          default:
            return nftGasLimit(errorMessages);
        }
      }
    )
  });
