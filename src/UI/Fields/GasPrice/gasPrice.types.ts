export enum GasMultiplierOptionLabelEnum {
  Standard = 'Standard',
  Fast = 'Fast',
  Faster = 'Faster'
}

export interface GasMultiplerOptionType {
  value: 1 | 2 | 3;
  label: `${GasMultiplierOptionLabelEnum}`;
  isChecked: boolean;
}
