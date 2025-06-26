import React, { PropsWithChildren } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { getExplorerLink } from '@multiversx/sdk-dapp/out/utils/transactions/getExplorerLink';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';
import { WithClassnameType } from 'types';

export interface ExplorerLinkPropsType
  extends PropsWithChildren,
    WithClassnameType {
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
  ...rest
}: ExplorerLinkPropsType) => {
  const {
    network: { explorerAddress }
  } = useGetNetworkConfig();

  const defaultContent = text ?? (
    <FontAwesomeIcon
      icon={customExplorerIcon ?? faArrowUpRightFromSquare}
      className='search'
    />
  );

  const link = getExplorerLink({
    explorerAddress: String(explorerAddress),
    to: page
  });

  return (
    <a
      href={link}
      target='_blank'
      className={classNames('link', 'ml-2', className)}
      rel='noreferrer'
      {...rest}
    >
      {children ?? defaultContent}
    </a>
  );
};
