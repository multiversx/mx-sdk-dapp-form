export function denominateSelector(elemet: HTMLElement) {
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
