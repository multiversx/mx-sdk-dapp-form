import React from 'react';
import { fallbackNetworkConfigurations } from '@elrondnetwork/dapp-core/constants/network';

import {
  EnvironmentsEnum,
  LoginMethodsEnum
} from '@elrondnetwork/dapp-core/types/enums';
import { render } from '@testing-library/react';
import { SendFormContainer } from 'containers';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import useGetInitialValues, {
  GetInitialValuesReturnType
} from 'hooks/useGetInitialValues';
import getTxType from 'operations/getTxType';
import { ExtendedValuesType } from 'types/form';
import { ConfirmScreen } from 'UI/ConfirmScreen';
import { Form } from 'UI/Form';

const activeNetwork = fallbackNetworkConfigurations[EnvironmentsEnum.devnet];

export const beforeAll = () => {
  const initValues = useGetInitialValues({
    configValues: {
      receiver: '',
      amount: '',
      tokenId: '',
      gasLimit: '',
      gasPrice: '',
      data: ''
    },
    egldLabel: 'EGLD',
    address: '',
    chainId: '1',
    balance: '0',
    nonce: 0,
    networkConfig: activeNetwork
  });

  const {
    initialValues,
    nft: initialNft,
    gasLimitCostError
    // computedTokens,
    // tokenFound,
    // computedTokenId
  } = initValues as GetInitialValuesReturnType;

  const validationValues: ExtendedValuesType = {
    ...initialValues,
    txType: getTxType({ nft: initialNft, tokenId: initialValues.tokenId }),
    address: '',
    chainId: '1',
    balance: '0'
    // ...(isLedger ? ledgerProps : {})
  };

  return render(
    <SendFormContainer
      networkConfig={{
        ...activeNetwork,
        skipFetchFromServer: true
      }}
      initGasLimitError={gasLimitCostError}
      initialValues={validationValues}
      onFormSubmit={() => 'log submit'}
      accountInfo={{
        address: '',
        nonce: 0,
        balance: '',
        providerType: LoginMethodsEnum.extra
      }}
      formInfo={{
        prefilledForm: Boolean(false),
        skipToConfirm: false,
        readonly: false,
        onCloseForm: () => 'this is close form'
      }}
      tokensInfo={{
        initialNft,
        initialTokens: []
      }}
    >
      <FormContent />
    </SendFormContainer>
  );
};

function FormContent() {
  const {
    formInfo: { areValidatedValuesReady }
  } = useSendFormContext();

  return areValidatedValuesReady ? (
    <ConfirmScreen providerType={LoginMethodsEnum.extra} />
  ) : (
    <Form />
  );
}
