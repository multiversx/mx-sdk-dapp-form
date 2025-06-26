import {
  ProviderType,
  ProviderTypeEnum
} from '@multiversx/sdk-dapp/out/providers/types/providerFactory.types';

export interface GetConfirmButtonLabelType {
  providerType: ProviderType;
  hasGuardianScreen: boolean;
}

export const getConfirmButtonLabel = ({
  providerType,
  hasGuardianScreen
}: GetConfirmButtonLabelType) => {
  if (hasGuardianScreen) {
    return 'Confirm & Continue';
  }

  switch (providerType) {
    case ProviderTypeEnum.walletConnect:
      return 'Confirm on xPortal';
    case ProviderTypeEnum.extension:
      return 'Confirm on DeFi Wallet';
    case ProviderTypeEnum.ledger:
      return 'Confirm on Ledger';
    default:
      return 'Confirm';
  }
};
