export interface TimezoneApiResponse {
  status: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  cityName: string;
  zoneName: string;
  abbreviation: string;
  dst: string;
  zoneStart: number;
  zoneEnd: number;
  timestamp: number;
  formatted: string;
}

export interface TimezoneSuccessResponse {
  data: TimezoneApiResponse;
}

interface TimezoneErrorResponse {
  status: 'error';
  msg: string;
}

export type TimezoneResponse = TimezoneSuccessResponse | TimezoneErrorResponse;
