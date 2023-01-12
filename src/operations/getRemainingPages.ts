import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';

export const getRemainingPages = ({
  count,
  maxCount
}: {
  count: number | undefined;
  maxCount: number;
}) => {
  if (count !== undefined && stringIsInteger(count.toString())) {
    const remainingCall = maxCount % count > 0 ? 1 : 0;
    const numberOfCalls = Array.from(
      Array(Math.floor(count / maxCount) + remainingCall).keys()
    );
    const excludingFirstPage = numberOfCalls
      .filter((i) => i !== 0)
      .map((i) => i + 1);
    return excludingFirstPage;
  } else return [];
};

export default getRemainingPages;
