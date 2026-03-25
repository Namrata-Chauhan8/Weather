import { OPENWEATHER_API_KEY } from '../../api/apiConfig';
import { api } from '../../api/api';
import { OpenWeatherForecastResponse } from './types';

const commonUrl = 'https://api.openweathermap.org';
const BASE_URL = `${commonUrl}/data/2.5/forecast`;

export async function fetchForecastByCity(
  city: string,
): Promise<OpenWeatherForecastResponse> {
  const trimmed = city.trim();
  if (!trimmed) {
    throw new Error('Enter a city name.');
  }
  if (!OPENWEATHER_API_KEY) {
    throw new Error(
      'Add your OpenWeather API key in weather/apiConfig.ts (OPENWEATHER_API_KEY).',
    );
  }

  return api<OpenWeatherForecastResponse>(
    BASE_URL,
    {
      q: trimmed,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
    },
    'GET',
  );
}
