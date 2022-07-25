import React from 'react';

import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { Denominate } from '@elrondnetwork/dapp-core/UI';

import styles from './styles.module.scss';

const Navbar = () => {
  const { account } = useGetAccountInfo();

  return (
    <div className={styles.navbar}>
      <h1>Choose your custom Dapp Core Form view</h1>
      <h5 className={styles.heading}>
        Balance: <Denominate value={account.balance} />
      </h5>
      <h6 className={styles.heading}>Address: {account.address}</h6>
    </div>
  );
};

export default Navbar;
