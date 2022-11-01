import { getAllowedReceivers } from 'apiCalls';
import { PartialNftType } from 'types';

const fetchedData: Record<string, string[] | null> = {};

/**
 * @returns a buffer dictionary of collections with canTransfer false
 */
export const getAllowedReceiversData = async (nft?: PartialNftType) => {
  if (!nft) {
    return null;
  }
  if (nft.collection in fetchedData) {
    return fetchedData[nft.collection];
  }
  const allowedReceivers = await getAllowedReceivers(nft);
  fetchedData[nft.collection] = allowedReceivers;
  return fetchedData[nft.collection];
};
