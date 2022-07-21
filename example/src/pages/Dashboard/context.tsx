import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  ComponentType
} from 'react';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import {
  getNetworkConfigForChainId,
  SendFormContainerPropsType,
  ExtendedValuesType
} from '@elrondnetwork/dapp-core-form';
import { Transaction } from '@elrondnetwork/erdjs';
import {
  useGetAccountInfo,
  useGetAccountProvider
} from '@elrondnetwork/dapp-core/hooks';

import { chainId } from 'config';

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
  const { account } = useGetAccountInfo();

  const onFormSubmit = async (
    formValues: ExtendedValuesType,
    transaction: Transaction | null
  ) => {
    if (!transaction) {
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
      onCloseForm: console.log,
      preFilledForm: false
    }
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const networkConfig = await getNetworkConfigForChainId(chainId);

      setValue((payload) => ({
        ...payload,
        networkConfig
      }));
    };

    fetchConfig();
  }, [chainId]);

  return (
    <DashboardContext.Provider value={value}>
      {props.children}
    </DashboardContext.Provider>
  );
};

const DashboardContextProvider = (Component: ComponentType) => (props: any) =>
  (
    <ContextProvider>
      <Component {...props} />
    </ContextProvider>
  );

const useFormProps = () => useContext(DashboardContext);

export { useFormProps, DashboardContextProvider };
