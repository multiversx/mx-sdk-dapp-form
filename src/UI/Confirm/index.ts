import { Component } from 'react';

import { Amount } from './Amount';
import { Data } from './Data';
import { Fee } from './Fee';
import { Receiver } from './Receiver';
import { Token } from './Token';

export class Confirm extends Component {
  static Receiver = Receiver;
  static Amount = Amount;
  static Fee = Fee;
  static Data = Data;
  static Token = Token;

  render() {
    return null;
  }
}

export default Confirm;
