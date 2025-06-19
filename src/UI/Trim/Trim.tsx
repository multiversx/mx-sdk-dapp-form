import React from 'react';
import { MvxTrimText } from '@multiversx/sdk-dapp-ui/dist/react/components';
import type { MvxTrimText as MvxTrimTextPropsType } from '@multiversx/sdk-dapp-ui/dist/web-components/mvx-trim-text';
import { WithClassnameType } from 'types';

interface TrimPropsType
  extends Partial<MvxTrimTextPropsType>,
    WithClassnameType {}

export const Trim = (props: TrimPropsType) => {
  return (
    <MvxTrimText
      text={props.text}
      class={props.className}
      dataTestId={props.dataTestId}
    />
  );
};
