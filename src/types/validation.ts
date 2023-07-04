export interface ValidationErrorMessagesType {
  insufficientFunds: string;
  invalidAddress: string;
  invalidGasPrice: string;
  invalidNumber: string;
  invalidFeePerDataByte: string;
  cannotBeZero: string;
  amountTooSmall: string;
  sameAsOwnerAddress: string;
  receiverNotAllowed: string;
  required: string;
  maxDecimalsAllowed: (decimals?: string | number) => string;
  tooHighGasLimit: (gasLimit?: string | number) => string;
  tooLowGasLimit: (gasLimit?: string | number) => string;
  tooLowGasPrice: (gasPrice?: string | number) => string;
}
