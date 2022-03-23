import React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons/faAngleRight';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, Card } from 'react-bootstrap';
import { useSendFormContext } from 'contexts';
import FeeInFiat from 'UI/Fields/FeeAccordion/FeeInFiat';
import GasLimit from 'UI/Fields/GasLimit';
import GasPrice from 'UI/Fields/GasPrice';

export const FeeAccordion = () => {
  const { gasInfo, tokensInfo } = useSendFormContext();
  const { feeLimit, hasErrors, gasCostLoading } = gasInfo;
  const { egldPriceInUsd } = tokensInfo;

  const [isOpen, setIsOpen] = React.useState(hasErrors);

  const toggle = () => {
    setIsOpen((open) => !open);
  };

  const accordionProps = {
    ...(hasErrors
      ? {
          defaultActiveKey: '0'
        }
      : {})
  };

  return (
    <Accordion className='mb-3' {...accordionProps}>
      <Accordion.Toggle
        as={Card.Text}
        eventKey='0'
        onClick={toggle}
        className='mb-0 d-inline-block'
      >
        <span className='d-flex flex-column'>
          <span>
            <FontAwesomeIcon
              style={{ marginLeft: '-0.28rem' }}
              icon={isOpen ? faAngleDown : faAngleRight}
            />{' '}
            <label className='mb-0 mr-2'>Fee</label>
            <span className='mr-2' data-testid='feeLimit'>
              <DappUI.Denominate value={feeLimit} showLastNonZeroDecimal />
            </span>
            {gasCostLoading && (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                className='fa-spin fast-spin'
              />
            )}
          </span>
          <FeeInFiat egldPriceInUsd={egldPriceInUsd} feeLimit={feeLimit} />
        </span>
      </Accordion.Toggle>
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
