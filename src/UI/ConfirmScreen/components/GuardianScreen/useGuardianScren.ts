import React, { useState } from 'react';

export const useGuardianScren = ({
  onSubmit,
  onCancel
}: {
  onSubmit: (code: string) => void;
  onCancel: () => void;
}) => {
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(true);
  const [value, setValue] = useState('');

  const checkValid = (value: string) => value?.length > 0;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setValue(code);
    setIsTouched(true);
    setIsValid(checkValid(code));
  };

  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setValue(code);
    setIsValid(checkValid(code));
  };

  const hadleSubmit = () => {
    const valid = checkValid(value);
    setIsValid(valid);
    setIsTouched(true);
    if (!valid) {
      return;
    }
    onSubmit(value);
  };

  const handleClose = () => {
    setValue('');
    setIsValid(true);
    setIsTouched(false);
    onCancel();
  };

  return {
    value,
    isValid,
    isTouched,
    onChange,
    onBlur,
    hadleSubmit,
    handleClose
  };
};
