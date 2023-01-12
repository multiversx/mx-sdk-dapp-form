import React from 'react';
import {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal
} from '@multiversx/sdk-dapp/UI';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';

import { BrowserRouter as Router } from 'react-router-dom';
import Layout from 'components/Layout';
import Dashboard from 'pages/Dashboard';

const environment = 'devnet';

const App = () => {
  return (
    <Router>
      <DappProvider
        environment={environment}
        customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
      >
        <Layout>
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals className='custom-class-for-modals' />
          <Dashboard />
        </Layout>
      </DappProvider>
    </Router>
  );
};

export default App;
