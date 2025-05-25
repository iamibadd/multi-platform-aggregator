export interface WeatherApiResponse {
  weather: Weather[];
  main: Temperature;
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

export interface Temperature {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherSuccessResponse {
  status: 'success';
  weather: Weather;
  temperature: Temperature;
}

interface WeatherErrorResponse {
  status: 'error';
  msg: string;
}

export type WeatherResponse = WeatherSuccessResponse | WeatherErrorResponse;
