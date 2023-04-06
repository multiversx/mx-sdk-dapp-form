import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

import { ExtendedValuesType } from 'types';
import styles from 'UI/Fields/styles.module.scss';
import { useGuardianScren } from './useGuardianForm';

const GUARDIAN_FIELD = 'guardian';

export const GuardianForm = ({ onBack }: { onBack: () => void }) => {
  const { formInfo } = useSendFormContext();
  const { onSubmitForm } = formInfo;

  const { setFieldValue, values, isSubmitting } =
    useFormikContext<ExtendedValuesType>();

  const onSubmit = (code: string) => {
    setFieldValue('code', code);
    onSubmitForm();
  };

  useEffect(() => {
    setError(values.codeError ?? '');
  }, [values]);

  const {
    isValid,
    isTouched,
    error,
    setError,
    onChange,
    onBlur,
    hadleSubmit,
    handleClose,
    value
  } = useGuardianScren({
    onSubmit,
    onCancel: onBack
  });

  return (
    <>
      <div className={styles.gas}>
        <label className={globals.label} htmlFor={GUARDIAN_FIELD}>
          Guardian Code
        </label>

        <div className={styles.wrapper}>
          <input
            type='text'
            id={GUARDIAN_FIELD}
            name={GUARDIAN_FIELD}
            data-testid={GUARDIAN_FIELD}
            required={true}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete='off'
            className={classNames(globals.input, {
              [globals.error]: !isValid
            })}
          />
        </div>

        {!isValid && (isTouched || isSubmitting) && (
          <div className={globals.error}>{error}</div>
        )}
      </div>
      <button
        className={classNames('my-3', globals.btn, globals.btnPrimary)}
        type='button'
        id='confirmCodeBtn'
        data-testid='confirmCodeBtn'
        disabled={!isValid}
        onClick={hadleSubmit}
      >
        Confirm code
      </button>

      <button
        className={classNames(globals.btn, globals.btnLink)}
        type='button'
        id='cancelCodeBtn'
        data-testid='cancelCodeBtn'
        onClick={handleClose}
      >
        Back
      </button>
    </>
  );
};
