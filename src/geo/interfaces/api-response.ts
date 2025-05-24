export interface GeoApiResponse {
  results: GeoResult[];
}

export interface GeoResult {
  annotations: {
    currency: Currency;
  };
  geometry: Coordinates;
}

export interface Currency {
  alternate_symbols: string[];
  decimal_mark: string;
  html_entity: string;
  iso_code: string;
  iso_numeric: string;
  name: string;
  smallest_denomination: number;
  subunit: string;
  subunit_to_unit: number;
  symbol: string;
  symbol_first: number;
  thousands_separator: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeoSuccessResponse {
  status: 'success';
  coordinates: Coordinates;
  currency: Currency;
}

interface GeoErrorResponse {
  status: 'error';
  msg: string;
}

export type GeoResponse = GeoSuccessResponse | GeoErrorResponse;
