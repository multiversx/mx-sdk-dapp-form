export const usdValue = ({
  amount,
  egldPriceInUsd,
  decimals = 2
}: {
  amount: string;
  egldPriceInUsd: number;
  decimals?: number;
}) => {
  const sum = (parseFloat(amount) * egldPriceInUsd).toFixed(decimals);
  return parseFloat(sum).toLocaleString('en', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
};

export default usdValue;
