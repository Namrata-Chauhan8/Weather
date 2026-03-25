import type { OpenWeatherMain } from './screens/weather/types';

export interface WeatherTheme {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
}

const themes: Record<string, WeatherTheme> = {
 Clear: {
    background: '#0EA5E9',
    surface: 'rgba(255,255,255,0.22)',
    text: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.85)',
    accent: '#FDE047',
  }, 
  Clouds: {
    background: '#64748B',
    surface: 'rgba(255,255,255,0.18)',
    text: '#F8FAFC',
    textMuted: 'rgba(248,250,252,0.8)',
    accent: '#CBD5E1',
  },
  Rain: {
    background: '#1E3A5F',  
    surface: 'rgba(255,255,255,0.14)',
    text: '#E2E8F0',
    textMuted: 'rgba(226,232,240,0.75)',
    accent: '#38BDF8',
  },
  Drizzle: {
    background: '#334155',
    surface: 'rgba(255,255,255,0.14)',
    text: '#F1F5F9',
    textMuted: 'rgba(241,245,249,0.78)',
    accent: '#7DD3FC',
  },
  Thunderstorm: {
    background: '#312E81',
    surface: 'rgba(255,255,255,0.16)',
    text: '#EEF2FF',
    textMuted: 'rgba(238,242,255,0.78)',
    accent: '#A5B4FC',
  },
  Snow: {
    background: '#94A3B8',
    surface: 'rgba(255,255,255,0.35)',
    text: '#0F172A',
    textMuted: 'rgba(15,23,42,0.72)',
    accent: '#FFFFFF',
  },
  Mist: {
    background: '#475569',
    surface: 'rgba(255,255,255,0.12)',
    text: '#F8FAFC',
    textMuted: 'rgba(248,250,252,0.75)',
    accent: '#94A3B8',
  },
  default: {
    background: '#0F172A',
    surface: 'rgba(255,255,255,0.12)',
    text: '#F8FAFC',
    textMuted: 'rgba(248,250,252,0.72)',
    accent: '#38BDF8',
  },
};

export function themeForWeatherMain(main: string | undefined): WeatherTheme {
  if (!main) {
    return themes.default;
  }
  const key = main as OpenWeatherMain;
  return themes[key] ?? themes.default;
}
