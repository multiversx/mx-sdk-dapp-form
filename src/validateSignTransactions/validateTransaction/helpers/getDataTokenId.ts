const esdtTransaction = 'esdtTransaction';
const scCall = 'scCall';

export function getDataTokenId(props: {
  type?: string;
  egldLabel: string;
  tokenId: string;
  nftFound?: boolean;
}) {
  const { type, egldLabel, tokenId, nftFound } = props;

  const esdtTx = !type || [scCall, esdtTransaction].includes(type);

  const dataTokenId =
    esdtTx && tokenId !== egldLabel && nftFound === false ? tokenId : '';

  return dataTokenId;
}

export default getDataTokenId;
