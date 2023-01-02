// DAILY
export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  relativehumidity_2m: string;
  visibility: string;
  windspeed_10m: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  relativehumidity_2m: number[];
  visibility: number[];
  windspeed_10m: number[];
  rain: number[];
}

export interface WeatherAPIResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: Hourly;
}

// WEEKLY
export interface WeeklyDailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  sunrise: string;
  rain_sum: string;
}

export interface WeeklyDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  rain_sum: number[];
  windspeed_10m_max: number[];
}

export interface WeeklyWeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: WeeklyDailyUnits;
  daily: WeeklyDaily;
}
