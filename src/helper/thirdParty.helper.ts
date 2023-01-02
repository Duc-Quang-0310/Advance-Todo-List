import axios, { AxiosResponse } from "axios";
import { add, format } from "date-fns";
import { WeatherAPIResponse, WeeklyWeatherResponse } from "../types/api.type";

import { WEB_MESSAGE } from "./../constants/message.const";
import { toastError } from "./toast";

interface ForecastProps {
  fromDate?: Date;
  toDate?: Date;
}

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=20.47&longitude=106.02&hourly=temperature_2m,relativehumidity_2m,rain,visibility,windspeed_10m&timezone=Asia%2FBangkok";

const WEATHER_WEEK_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=20.47&longitude=106.02&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,windspeed_10m_max&timezone=Asia%2FBangkok&";

// default format &start_date=2022-12-26&end_date=2022-12-30

export const fetchTodayWeather = async (day: Date = new Date()) => {
  const fromDateFormatted = format(day, "yyyy-MM-dd");
  const toDateFormatted = format(day, "yyyy-MM-dd");

  try {
    const response: AxiosResponse<WeatherAPIResponse> = await axios.get(
      `${WEATHER_URL}&start_date=${fromDateFormatted}&end_date=${toDateFormatted}`
    );

    return response.data;
  } catch (error) {
    toastError({
      title: WEB_MESSAGE.COMMON_ERROR,
    });

    return null;
  }
};

export const fetchWeatherInRange = async ({
  fromDate,
  toDate,
}: ForecastProps) => {
  const defaultFromDate = format(
    !fromDate ? new Date() : fromDate,
    "yyyy-MM-dd"
  );
  const defaultToDate = format(!toDate ? new Date() : toDate, "yyyy-MM-dd");

  try {
    const response: AxiosResponse<WeeklyWeatherResponse> = await axios.get(
      `${WEATHER_WEEK_URL}&start_date=${defaultFromDate}&end_date=${defaultToDate}`
    );

    return response.data;
  } catch (error) {
    toastError({
      title: WEB_MESSAGE.COMMON_ERROR,
    });
    return null;
  }
};
