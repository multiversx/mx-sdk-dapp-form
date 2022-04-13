const esdtTransaction = 'esdtTransaction';
const scCall = 'scCall';

export function getDataTokenId(props: {
  type?: string;
  egldLabel: string;
  tokenId: string;
  nftFound?: boolean;
}) {
  const { type, egldLabel, tokenId, nftFound } = props;
  const plainEsdtTransaction = type == null;

  const esdtTx =
    plainEsdtTransaction || type === esdtTransaction || type === scCall;

  const dataTokenId =
    esdtTx && tokenId !== egldLabel && nftFound === false ? tokenId : '';

  return dataTokenId;
}

export default getDataTokenId;
