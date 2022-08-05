import React from 'react';
import { render } from '@testing-library/react';
import { TestWrapper, TestWrapperType } from './TestWrapper';

export const beforeAll = (props?: TestWrapperType) => {
  return render(<TestWrapper {...props} />);
};
