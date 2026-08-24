import React, { PropsWithChildren } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getExplorerLink } from '@multiversx/sdk-dapp/out/utils/transactions/getExplorerLink';
import classNames from 'classnames';
import { useNetworkConfigContext } from 'contexts/NetworkContext';
import { MvxExplorerLink } from 'lib/sdkDappUi';
import { WithClassnameType } from 'types';

export interface ExplorerLinkPropsType
  extends PropsWithChildren, WithClassnameType {
  page: string;
  text?: any;
  customExplorerIcon?: IconProp;
  title?: string;
  onClick?: () => void;
  'data-testid'?: string;
}

export const ExplorerLink = ({
  page,
  text,
  className = 'dapp-explorer-link',
  children,
  customExplorerIcon,
  title,
  onClick,
  ...rest
}: ExplorerLinkPropsType) => {
  const {
    networkConfig: { explorerAddress }
  } = useNetworkConfigContext();

  const link = getExplorerLink({
    explorerAddress: String(explorerAddress),
    to: page
  });

  const needsAnchor =
    children != null ||
    text != null ||
    customExplorerIcon != null ||
    title != null ||
    onClick != null;

  if (needsAnchor) {
    const defaultContent = text ?? (
      <FontAwesomeIcon
        icon={customExplorerIcon ?? faArrowUpRightFromSquare}
        className='search'
      />
    );

    return (
      <a
        href={link}
        target='_blank'
        className={classNames('link', 'ml-2', className)}
        rel='noreferrer'
        title={title}
        onClick={onClick}
        {...rest}
      >
        {children ?? defaultContent}
      </a>
    );
  }

  return (
    <MvxExplorerLink
      link={link}
      class={classNames('link', 'ml-2', className)}
      dataTestId={rest['data-testid']}
    />
  );
};
