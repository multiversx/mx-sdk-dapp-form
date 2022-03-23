import React from 'react';
import Amount from 'UI/Confirm/Amount';
import Data from 'UI/Confirm/Data';
import Fee from 'UI/Confirm/Fee';
import To from 'UI/Confirm/To';
import Token from 'UI/Confirm/Token';

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
