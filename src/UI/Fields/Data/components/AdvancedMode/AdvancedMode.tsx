import React, { useEffect, useState } from 'react';
import {
  faScrewdriverWrench,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormikContext } from 'formik';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType } from 'types/form';

import { useIsDataDisabled } from '../../hooks';
import styles from './styles.module.scss';

export const AdvancedMode = () => {
  const {
    formInfo: { readonly, isEgldTransaction }
  } = useSendFormContext();
  const { setFieldValue, values } = useFormikContext<ExtendedValuesType>();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isDataFieldDisabled = useIsDataDisabled();

  const showAdvancedMode =
    !isEnabled && !readonly && isDataFieldDisabled && Boolean(values.data);

  const handleAdvancedModeEnabled = () => {
    setIsEnabled(true);
    setFieldValue('isAdvancedModeEnabled', true);
  };

  const handleShowConfirm = () => {
    setShowConfirm(true);

    setTimeout(() => {
      setShowConfirm(false);
    }, 5000);
  };

  useEffect(() => {
    if (!isEgldTransaction && isEnabled) {
      setIsEnabled(false);
    }
  }, [isEgldTransaction, values.amount]);

  if (!showAdvancedMode) {
    return null;
  }

  if (showConfirm) {
    return (
      <div
        className={styles.advanced}
        data-testid={FormDataTestIdsEnum.confirmAdvancedMode}
        onClick={handleAdvancedModeEnabled}
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
      onClick={handleShowConfirm}
    >
      <FontAwesomeIcon icon={faScrewdriverWrench} className='i-icon' />
      <span className={styles.advancedText}>Advanced</span>
    </div>
  );
};
