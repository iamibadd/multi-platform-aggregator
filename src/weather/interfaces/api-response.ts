export interface WeatherApiResponse {
  weather: Weather[];
}

export interface Coordinates {
  lon: number;
  lat: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherSuccessResponse {
  status: 'success';
  weather: Weather;
}

interface WeatherErrorResponse {
  status: 'error';
  msg: string;
}

export type WeatherResponse = WeatherSuccessResponse | WeatherErrorResponse;
