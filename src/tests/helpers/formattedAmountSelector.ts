export function formattedAmountSelector(elemet: HTMLElement) {
  const intAmount = elemet.querySelector('span[data-testid="formatAmountInt"]')
    ?.textContent;
  const decimalAmount = elemet.querySelector(
    'span[data-testid="formatAmountDecimals"]'
  )?.textContent;
  return {
    intAmount,
    decimalAmount
  };
}
