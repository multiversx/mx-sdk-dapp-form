import React from 'react';
import { MvxTrim } from '@multiversx/sdk-dapp-ui/react';
import type { MvxTrim as MvxTrimTextPropsType } from '@multiversx/sdk-dapp-ui/web-components/mvx-trim';
import { WithClassnameType } from 'types';

interface TrimPropsType
  extends Partial<MvxTrimTextPropsType>,
    WithClassnameType {}

export const Trim = (props: TrimPropsType) => {
  return (
    <MvxTrim
      text={props.text}
      class={props.className}
      dataTestId={props.dataTestId}
    />
  );
};
