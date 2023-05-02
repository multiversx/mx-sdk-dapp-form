import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types/enums.types';

interface GetConfirmButtonLabelType {
  providerType: string;
  hasGuardianScreen: boolean;
}

export const getConfirmButtonLabel = ({
  providerType,
  hasGuardianScreen
}: GetConfirmButtonLabelType) => {
  let confirmText = 'Confirm';

  if (hasGuardianScreen) {
    return confirmText;
  }

  switch (providerType) {
    case LoginMethodsEnum.walletconnect:
    case LoginMethodsEnum.extension:
      confirmText = 'Confirm & Check your App';
      break;
    case LoginMethodsEnum.ledger:
      confirmText = 'Confirm & Check your Ledger';
      break;
    default:
      break;
  }

  return confirmText;
};
