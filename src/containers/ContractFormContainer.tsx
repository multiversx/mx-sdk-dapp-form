import React, { useState } from 'react';
import { ValueKeyType, ValuesType } from 'types';
import {
  SendFormContainer as DefaultSendFormContainer,
  SendFormContainerPropsType
} from './SendFormContainer';

type ValuesTestType = ValuesType | null;

interface ContractFormContainerOneType {
  children: ({
    values,
    setValues
  }: {
    values: ValuesTestType;
    setValues: React.Dispatch<React.SetStateAction<ValuesTestType>>;
  }) => React.ReactElement;
  SendFormContainer?: typeof DefaultSendFormContainer;
  propsExcludingValues: Omit<SendFormContainerPropsType, ValueKeyType>;
}

export const ContractFormContainerOne = ({
  children,
  SendFormContainer = DefaultSendFormContainer,
  propsExcludingValues
}: ContractFormContainerOneType) => {
  const [values, setValues] = useState<ValuesTestType>(null);

  if (values) {
    return <SendFormContainer {...{ ...propsExcludingValues, ...values }} />;
  }

  return children({ values, setValues });
};

// const MyPageOne = () => {
//   const propsExcludingValues = {} as ContractFormContainerType['propsExcludingValues'];

//   return (
//     <ContractFormContainerOne propsExcludingValues={propsExcludingValues}>
//       {({ values, setValues }) => {
//         console.log(values, setValues);
//         const a = {} as ValuesType;
//         return (
//           <button
//             onClick={() => {
//               setValues(a);
//             }}
//           >
//             Submit
//           </button>
//         );
//       }}
//     </ContractFormContainerOne>
//   );
// };
