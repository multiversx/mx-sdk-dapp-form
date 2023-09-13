import React, { useState } from 'react';
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

import { useIsDataDisabled } from '../hooks';
import styles from './styles.module.scss';

export const AdvancedMode = () => {
  const {
    networkConfig: { egldLabel }
  } = useNetworkConfigContext();
  const {
    formInfo: { readonly }
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
    const data = values.data;
    setFieldValue(ValuesEnum.amount, '0');
    setFieldValue(ValuesEnum.tokenId, egldLabel);
    setTimeout(() => {
      setFieldValue(ValuesEnum.data, data);
    });
  };

  const activateConfirm = () => {
    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
    }, 5000);
  };

  if (!showEnabled) {
    return null;
  }

  return (
    <div
      data-testid={FormDataTestIdsEnum.enableData}
      className={styles.advanced}
      onClick={showConfirm ? enableDataField : activateConfirm}
    >
      <FontAwesomeIcon
        icon={showConfirm ? faCheck : faScrewdriverWrench}
        className='i-icon'
      />

      <span className={styles.advancedText}>
        {showConfirm ? 'Confirm' : 'Advanced'}
      </span>
    </div>
  );
};
