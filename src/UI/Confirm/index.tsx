import React from 'react';

import { Amount } from './Amount';
import { Data } from './Data';
import { Fee } from './Fee';
import { To } from './To';
import { Token } from './Token';

export class Confirm extends React.Component {
  static To = To;
  static Amount = Amount;
  static Fee = Fee;
  static Data = Data;
  static Token = Token;

  render() {
    return null;
  }
}

export default Confirm;
