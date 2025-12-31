export interface Term {
  base: number;
  exponent: number | Term[];
  coefficient: number;
}

export interface ConversionStep {
  step: number;
  description: string;
  expression: string;
}
