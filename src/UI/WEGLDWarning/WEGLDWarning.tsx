import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classNames from 'classnames';
import { getWegldIdForChainId } from 'apiCalls';
import { WEGLD_MESSAGE } from 'constants/index';
import { useNetworkConfigContext } from 'contexts';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { WithClassnameType } from 'types';

export interface WEGLDWarningPropsType extends WithClassnameType {
  tokenId: string;
}

export const WEGLDWarningComponent = (
  props: WEGLDWarningPropsType & WithStylesImportType
) => {
  const { tokenId, className, styles } = props;
  const {
    networkConfig: { chainId }
  } = useNetworkConfigContext();

  const wegldId = getWegldIdForChainId(chainId);

  if (wegldId !== tokenId) {
    return null;
  }

  return (
    <div className={classNames(styles?.wegldWarning, className)}>
      <div className={styles?.wegldWarningHeading}>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className={styles?.wegldWarningIcon}
          size='lg'
        />

        <div className={styles?.wegldWarningTitle}>
          <div className={styles?.wegldWarningLabel}>Warning!</div>
          <div className={styles?.wegldWarningMessage}>{WEGLD_MESSAGE}</div>
        </div>
      </div>
    </div>
  );
};

export const WEGLDWarning = withStyles(WEGLDWarningComponent, {
  ssrStyles: () => import('UI/WEGLDWarning/styles.scss'),
  clientStyles: () => require('UI/WEGLDWarning/styles.scss').default
});
