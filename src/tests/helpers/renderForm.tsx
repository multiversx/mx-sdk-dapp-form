import React from 'react';
import { render, queries, RenderResult } from '@testing-library/react';
import { TestWrapper, TestWrapperType } from './TestWrapper';

export const renderForm: (
  props?: TestWrapperType
) => RenderResult<typeof queries, HTMLElement, HTMLElement> = (props) => {
  return render(<TestWrapper {...props} />);
};
