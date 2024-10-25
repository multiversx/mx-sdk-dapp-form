import { GAS_LIMIT } from '@multiversx/sdk-dapp/constants/index';
import {
  formattedConfigGasPrice,
  maxAcceptedGasPrice
} from 'operations/formattedConfigGasPrice';
import { ValidationErrorMessagesType } from '../types/validation';

export const defaultErrorMessages: ValidationErrorMessagesType = {
  insufficientFunds: 'Insufficient funds',
  invalidAddress: 'Invalid address',
  invalidGasPrice: 'Invalid gas price',
  invalidNumber: 'Invalid number',
  invalidFeePerDataByte: 'Invalid fee per data byte',
  cannotBeZero: 'Cannot be zero',
  required: 'Required',
  amountTooSmall: 'Amount too small',
  sameAsOwnerAddress: 'Same as owner address',
  receiverNotAllowed: 'Receiver not allowed',
  invalidHerotag: 'Invalid herotag',
  tooLowGasLimit: (gasLimit = GAS_LIMIT) =>
    `Gas limit must be greater or equal to ${gasLimit}`,
  tooHighGasLimit: (gasLimit = GAS_LIMIT) =>
    `Gas limit must be lower than ${gasLimit}`,
  tooLowGasPrice: (lowestGasPrice = formattedConfigGasPrice) =>
    `Gas price must be greater or equal to ${lowestGasPrice}`,
  tooHighGasPrice: (highestGasPrice = maxAcceptedGasPrice) =>
    `Gas price must be lower or equal to ${highestGasPrice}`,
  maxDecimalsAllowed: (decimals) => `Maximum ${decimals} decimals allowed`
};
