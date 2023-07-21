export const trimReceiverDomain = (receiver?: string) => {
  if (!receiver) {
    return;
  }

  return receiver.substring(0, receiver.lastIndexOf('.'));
};
