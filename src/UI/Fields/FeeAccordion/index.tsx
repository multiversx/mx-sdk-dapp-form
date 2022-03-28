import React, { useContext } from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import {
  faAngleDown,
  faAngleRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Accordion,
  AccordionContext,
  useAccordionButton
} from 'react-bootstrap';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import GasLimit from '../GasLimit';
import GasPrice from '../GasPrice';
import FeeInFiat from './FeeInFiat';

export const FeeAccordion = () => {
  const {
    gasInfo,
    tokensInfo,
    account: { egldLabel }
  } = useSendFormContext();
  const { feeLimit, hasErrors, gasCostLoading } = gasInfo;
  const { egldPriceInUsd } = tokensInfo;

  const accordionProps = {
    ...(hasErrors
      ? {
          defaultActiveKey: '0'
        }
      : {})
  };

  function ContextAwareToggle({ eventKey, callback }: any) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    );

    const isOpen = activeEventKey === eventKey;

    return (
      <span className='d-flex flex-column' onClick={decoratedOnClick}>
        <span>
          <FontAwesomeIcon
            style={{ marginLeft: '-0.28rem' }}
            icon={isOpen ? faAngleDown : faAngleRight}
          />{' '}
          <label className='mb-0 mr-2'>Fee</label>
          <span className='mr-2' data-testid='feeLimit'>
            <DappUI.Denominate
              value={feeLimit}
              showLastNonZeroDecimal
              egldLabel={egldLabel}
            />
          </span>
          {gasCostLoading && (
            <FontAwesomeIcon icon={faSpinner} className='fa-spin fast-spin' />
          )}
        </span>
        <FeeInFiat egldPriceInUsd={egldPriceInUsd} feeLimit={feeLimit} />
      </span>
    );
  }

  return (
    <Accordion className='mb-3' {...accordionProps}>
      <ContextAwareToggle eventKey='0' />
      <Accordion.Collapse eventKey='0'>
        <div className='mt-2 py-3 bg-light rounded border container'>
          <GasPrice />
          <GasLimit />
        </div>
      </Accordion.Collapse>
    </Accordion>
  );
};

export default FeeAccordion;
