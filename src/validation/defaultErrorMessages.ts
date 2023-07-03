import { GAS_LIMIT } from '@multiversx/sdk-dapp/constants/index';
import { formattedConfigGasPrice } from 'operations/formattedConfigGasPrice';
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
  tooLowGasLimit: (gasLimit = GAS_LIMIT) =>
    `Gas limit cannot be lower than ${gasLimit}`,
  tooHighGasLimit: (gasLimit = GAS_LIMIT) =>
    `Gas limit cannot be higher than ${gasLimit}`,
  tooLowGasPrice: (gasPrice = formattedConfigGasPrice) =>
    `Gas price cannot be higher than ${gasPrice}`,
  maxDecimalsAllowed: (decimals) => `Maximum ${decimals} decimals allowed`
};
