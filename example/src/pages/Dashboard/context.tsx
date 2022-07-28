import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  ComponentType
} from 'react';

import {
  getNetworkConfigForChainId,
  SendFormContainerPropsType,
  ExtendedValuesType
} from '@elrondnetwork/dapp-core-form';

import {
  useGetNetworkConfig,
  useGetAccountInfo,
  useGetAccountProvider
} from '@elrondnetwork/dapp-core/hooks';

import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { Transaction } from '@elrondnetwork/erdjs';

interface ContextType {
  children: ReactNode;
}

const DashboardContext = createContext<SendFormContainerPropsType>({
  onFormSubmit: () => false,
  networkConfig: null,
  children: null,
  accountInfo: {},
  formInfo: {}
});

const ContextProvider = (props: ContextType) => {
  const { providerType } = useGetAccountProvider();
  const { chainID } = useGetNetworkConfig();
  const { account } = useGetAccountInfo();

  const onFormSubmit = async (
    formValues: ExtendedValuesType,
    transaction: Transaction | null
  ) => {
    if (!transaction) {
      console.warn(
        'Transaction either missing, or no pending transaction available.'
      );

      return;
    }

    try {
      await sendTransactions({
        transactions: [transaction]
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [value, setValue] = useState<SendFormContainerPropsType>({
    onFormSubmit,
    networkConfig: '',
    children: '',
    accountInfo: {
      providerType,
      nonce: account.nonce,
      address: account.address,
      balance: account.balance
    },
    formInfo: {
      onCloseForm: () => false,
      preFilledForm: false,
      conditionalUI: {
        hideAmountMaxButton: true
      }
    }
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const networkConfig = await getNetworkConfigForChainId(chainID);

      setValue((payload) => ({
        ...payload,
        networkConfig
      }));
    };

    fetchConfig();
  }, [chainID]);

  return (
    <DashboardContext.Provider value={value}>
      {props.children}
    </DashboardContext.Provider>
  );
};

export const DashboardContextProvider =
  (Component: ComponentType) => (props: any) =>
    (
      <ContextProvider>
        <Component {...props} />
      </ContextProvider>
    );

export const useFormProps = () => useContext(DashboardContext);
