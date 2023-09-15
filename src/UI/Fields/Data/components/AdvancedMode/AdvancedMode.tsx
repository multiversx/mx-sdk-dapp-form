import React, { useEffect, useState } from 'react';
import {
  faScrewdriverWrench,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormikContext } from 'formik';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType, ValuesEnum } from 'types/form';

import { useIsDataDisabled } from '../../hooks';
import styles from './styles.module.scss';

export const AdvancedMode = () => {
  const {
    networkConfig: { egldLabel }
  } = useNetworkConfigContext();
  const {
    formInfo: { readonly, isEgldTransaction }
  } = useSendFormContext();
  const { setFieldValue, values } = useFormikContext<ExtendedValuesType>();
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const isDataDisabled = useIsDataDisabled();
  const isDataEnabled = isEnabled ?? !isDataDisabled;
  const isDisabled = !isDataEnabled;
  const showEnabled =
    isEnabled === null && isDisabled && !readonly && Boolean(values.data);

  const enableDataField = () => {
    setIsEnabled(true);
    // data will be changed when resetting to EGLD so we set it back after
    const { data, gasLimit } = values;
    setFieldValue(ValuesEnum.amount, '0');
    setFieldValue(ValuesEnum.tokenId, egldLabel);
    setTimeout(() => {
      setFieldValue(ValuesEnum.data, data);
      setFieldValue(ValuesEnum.gasLimit, gasLimit);
    });
  };

  const activateConfirm = () => {
    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
    }, 5000);
  };

  useEffect(() => {
    if (!isEgldTransaction && isEnabled != null) {
      setIsEnabled(null);
    }
  }, [isEgldTransaction, values.amount]);

  if (!showEnabled) {
    return null;
  }

  if (showConfirm) {
    return (
      <div
        className={styles.advanced}
        data-testid={FormDataTestIdsEnum.confirmAdvancedMode}
        onClick={enableDataField}
      >
        <FontAwesomeIcon icon={faCheck} className='i-icon' />
        <span className={styles.advancedText}>Confirm</span>
      </div>
    );
  }

  return (
    <div
      data-testid={FormDataTestIdsEnum.enableAdvancedMode}
      className={styles.advanced}
      onClick={activateConfirm}
    >
      <FontAwesomeIcon icon={faScrewdriverWrench} className='i-icon' />
      <span className={styles.advancedText}>Advanced</span>
    </div>
  );
};
