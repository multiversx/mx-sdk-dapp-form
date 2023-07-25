import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types/enums.types';

export interface GetConfirmButtonLabelType {
  providerType: string;
  hasGuardianScreen: boolean;
}

export const getConfirmButtonLabel = ({
  providerType,
  hasGuardianScreen
}: GetConfirmButtonLabelType) => {
  if (hasGuardianScreen) {
    return 'Proceed to Guardian';
  }

  if (providerType === LoginMethodsEnum.walletconnectv2) {
    return 'Confirm on xPortal';
  }

  if (providerType === LoginMethodsEnum.extension) {
    return 'Confirm on DeFi Wallet';
  }

  if (providerType === LoginMethodsEnum.ledger) {
    return 'Confirm on Ledger';
  }

  return 'Confirm';
};
