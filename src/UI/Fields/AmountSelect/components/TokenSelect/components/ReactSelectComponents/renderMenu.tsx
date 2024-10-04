import React from 'react';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { components } from 'react-select';

import { WithStylesImportType } from 'hocs/withStyles';

export const renderMenu =
  (styles?: WithStylesImportType['styles']): typeof components.Menu =>
  (props) => {
    return (
      <components.Menu {...props} className={styles?.menu}>
        {props.selectProps.isLoading ? (
          <div className={styles?.loading}>
            <FontAwesomeIcon
              icon={faCircleNotch}
              className='fa-spin'
              size='lg'
            />
          </div>
        ) : (
          props.children
        )}
      </components.Menu>
    );
  };
