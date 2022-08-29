export function denominateSelector(elemet: HTMLElement) {
  const intAmount = elemet.querySelector(
    'span[data-testid="denominateIntAmount"]'
  )?.textContent;
  const decimalAmount = elemet.querySelector(
    'span[data-testid="denominateDecimals"]'
  )?.textContent;
  return {
    intAmount,
    decimalAmount
  };
}
