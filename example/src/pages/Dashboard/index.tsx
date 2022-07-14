import React from 'react';
import {
  useGetAccountInfo,
  useGetAccountProvider
} from '@elrondnetwork/dapp-core/hooks';
import { SendFormContainer } from '@elrondnetwork/dapp-core-form';
import {
  ConfirmScreen,
  SendLoader,
  Form
} from '@elrondnetwork/dapp-core-form/UI';

const Dashboard = () => {
  const { providerType } = useGetAccountProvider();
  const { account } = useGetAccountInfo();

  const props = {
    onFormSubmit: console.log,
    networkConfig: {
      default: true,
      id: 'devnet',
      name: 'Devnet',
      chainId: 'D',
      apiAddress: 'https://devnet-api.elrond.com',
      theme: 'testnet',
      egldLabel: 'xEGLD',
      faucet: true,
      walletAddress: 'https://devnet-wallet.elrond.com',
      explorerAddress: 'https://devnet-explorer.elrond.com',
      auctionContract:
        'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l',
      stakingContract:
        'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllls0lczs7',
      delegationContract:
        'erd1qqqqqqqqqqqqqpgqp699jngundfqw07d8jzkepucvpzush6k3wvqyc44rx',
      esdtContract:
        'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u',
      delegationApi: 'https://devnet-delegation-api.elrond.com',
      graphQlAddress: 'https://devnet-nfts-graph.elrond.com/graphql'
    },
    formInfo: {
      onCloseForm: console.log,
      preFilledForm: false
    },
    accountInfo: {
      nonce: account.nonce,
      providerType,
      address: account.address,
      balance: account.balance
    }
  };

  console.log({ providerType });

  return (
    <div style={{ width: 500 }}>
      <SendFormContainer {...props}>
        <Form />
        <SendLoader />
        <ConfirmScreen providerType={providerType} />
      </SendFormContainer>
    </div>
  );
};

export default Dashboard;
