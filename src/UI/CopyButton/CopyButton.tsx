import React, { useState, MouseEvent } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { MvxCopyButton } from 'lib/sdkDappUi';
import { WithClassnameType } from 'types';
import { copyTextToClipboard } from './helpers/copyToClipboard';

export interface CopyButtonPropsType extends WithClassnameType {
  text: string;
  copyIcon?: IconProp;
  successIcon?: IconProp;
}

const CustomIconCopyButton = ({
  text,
  className,
  copyIcon = faCopy,
  successIcon = faCheck
}: CopyButtonPropsType) => {
  const [copyResult, setCopyResut] = useState({
    default: true,
    success: false
  });

  const handleCopyToClipboard = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const noSpaces = text ? text.trim() : text;

    setCopyResut({
      default: false,
      success: await copyTextToClipboard(noSpaces)
    });

    setTimeout(() => {
      setCopyResut({
        default: true,
        success: false
      });
    }, 1000);
  };

  return (
    <a
      href='/#'
      onClick={handleCopyToClipboard}
      className={classNames('copy', className)}
    >
      {copyResult.default || !copyResult.success ? (
        <FontAwesomeIcon icon={copyIcon} />
      ) : (
        <FontAwesomeIcon icon={successIcon} />
      )}
    </a>
  );
};

export const CopyButton = ({
  text,
  className = 'dapp-copy-button',
  copyIcon,
  successIcon
}: CopyButtonPropsType) => {
  if (copyIcon || successIcon) {
    return (
      <CustomIconCopyButton
        text={text}
        className={className}
        copyIcon={copyIcon}
        successIcon={successIcon}
      />
    );
  }

  return <MvxCopyButton text={text} class={classNames('copy', className)} />;
};
