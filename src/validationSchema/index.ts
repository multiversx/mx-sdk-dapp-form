import receiver from 'logic/validationSchema/receiver';
import { object, mixed, string } from 'yup';
import { TxTypeEnum, ValidationSchemaType } from 'logic/types';
import data from 'logic/validationSchema/data';
import egldAmount from 'logic/validationSchema/egldAmount';
import egldGasLimit from 'logic/validationSchema/egldGasLimit';
import esdtAmount from 'logic/validationSchema/esdtAmount';
import esdtGasLimit from 'logic/validationSchema/esdtGasLimit';
import gasPrice from 'logic/validationSchema/gasPrice';
import nftAmount from 'logic/validationSchema/nftAmount';
import nftGasLimit from 'logic/validationSchema/nftGasLimit';

export const validationSchema = (props: ValidationSchemaType) => {
  const { nft, txType } = props;

  const baseFields = {
    receiver: receiver(props),
    tokenId: string().required('Required'),
    gasPrice: gasPrice(),
    data: data(props)
  };
  switch (txType) {
    case TxTypeEnum.ESDT:
      return object().shape({
        ...baseFields,
        amount: esdtAmount(props),
        gasLimit: esdtGasLimit(props)
      });
    case TxTypeEnum.EGLD:
      return object().shape({
        ...baseFields,
        amount: egldAmount(props),
        gasLimit: egldGasLimit(props)
      });
    // NFT & SFT & MetaESDT
    default:
      return object().shape({
        ...baseFields,
        amount: nft ? nftAmount({ ...props, nft }) : mixed(),
        gasLimit: nftGasLimit(props)
      });
  }
};

export default validationSchema;
