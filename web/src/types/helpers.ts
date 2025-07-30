export type ValidNumericField<T> = {
  [K in keyof T]: T[K] extends number | number | null ? K : never;
}[keyof T];
