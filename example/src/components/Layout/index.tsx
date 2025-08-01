import React, { PropsWithChildren } from 'react';
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers';
import { useLocation } from 'react-router-dom';

import routes, { routeNames } from 'routes';
import Navbar from './Navbar';

const Layout = ({ children }: PropsWithChildren) => {
  const { search } = useLocation();

  return (
    <div className='bg-light d-flex flex-column flex-fill wrapper'>
      <Navbar />

      <main className='d-flex flex-column flex-grow-1'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={`${routeNames.unlock}${search}`}
        >
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
    </div>
  );
};

export default Layout;
