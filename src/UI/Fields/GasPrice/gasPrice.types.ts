export enum PpuOptionLabelEnum {
  Standard = 'Standard',
  Fast = 'Fast',
  Faster = 'Faster'
}

export interface PpuOptionType {
  value: number;
  label: `${PpuOptionLabelEnum}`;
  isChecked: boolean;
}
