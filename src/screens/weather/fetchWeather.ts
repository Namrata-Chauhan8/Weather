import { OPENWEATHER_API_KEY } from '../../api/apiConfig';
import { api } from '../../api/api';
import type { OpenWeatherResponse, ForecastResponse } from './types';

const commonUrl = 'https://api.openweathermap.org';

const BASE_URL = `${commonUrl}/data/2.5/weather`;
const FORECAST_BASE_URL = `${commonUrl}/data/2.5/forecast`;

const ICON_BASE_URL = 'https://openweathermap.org/img/wn';

export async function fetchWeatherByCity(
  city: string,
): Promise<OpenWeatherResponse> {
  const trimmed = city.trim();
  if (!trimmed) {
    throw new Error('Enter a city name.');
  }
  if (!OPENWEATHER_API_KEY) {
    throw new Error(
      'Add your OpenWeather API key in weather/apiConfig.ts (OPENWEATHER_API_KEY).',
    );
  }

  return api(
    BASE_URL,
    {
      q: trimmed,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
    },
    'GET',
  );
}

export function weatherIconUrl(iconCode: string): string {
  return `${ICON_BASE_URL}/${iconCode}@2x.png`;
}

export async function fetchForecastByCity(
  city: string,
): Promise<ForecastResponse> {
  const trimmed = city.trim();
  if (!trimmed) {
    throw new Error('Enter a city name.');
  }

  return api(
    FORECAST_BASE_URL,
    {
      q: trimmed,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
    },
    'GET',
  );
}
