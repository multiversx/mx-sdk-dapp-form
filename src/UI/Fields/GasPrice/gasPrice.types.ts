export enum PpuOptionLabelEnum {
  Standard = 'Standard',
  Fast = 'Fast',
  Faster = 'Faster'
}

export interface PpuOptionType {
  label: 'Standard' | 'Fast' | 'Faster';
  isChecked: boolean;
  value: number;
}
