import React from 'react';
import { components } from 'react-select';

export const ListOption = (props: any) => {
  return (
    <div
      className={`token-option ${props.isSelected ? 'is-selected' : ''}`}
      data-testid={`${props.value}-option`}
    >
      <components.Option {...props} />
    </div>
  );
};
