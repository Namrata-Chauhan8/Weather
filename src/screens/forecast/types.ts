export interface OpenWeatherForecastItem {
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }
  
  export interface OpenWeatherForecastResponse {
    city: {
      name: string;
      country?: string;
    };
    list: OpenWeatherForecastItem[];
  }