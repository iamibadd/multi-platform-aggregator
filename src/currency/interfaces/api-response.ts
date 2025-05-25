export interface CurrencyApiResponse {
  conversion_rates: Record<string, number>;
}

export interface CurrencySuccessResponse {
  status: 'success';
  conversion_rates: Record<string, number>;
}

export interface CurrencyErrorResponse {
  status: 'error';
  msg: string;
}

export type CurrencyResponse = CurrencySuccessResponse | CurrencyErrorResponse;
