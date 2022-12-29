import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";
import { WeatherAPIResponse } from "../types/api.type";

import { WEB_MESSAGE } from "./../constants/message.const";
import { toastError } from "./toast";

interface ForecastProps {
  fromDate?: string | Date;
  toDate?: string | Date;
}

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=20.47&longitude=106.02&hourly=temperature_2m,relativehumidity_2m,rain,visibility,windspeed_10m&timezone=Asia%2FBangkok";

// default format &start_date=2022-12-26&end_date=2022-12-30

export const fetchWeatherInRange = async ({
  fromDate = new Date(),
  toDate = new Date(),
}: ForecastProps) => {
  const fromDateFormatted = format(
    typeof fromDate === "string" ? new Date(fromDate) : fromDate,
    "yyyy-MM-dd"
  );
  const toDateFormatted = format(
    typeof toDate === "string" ? new Date(toDate) : toDate,
    "yyyy-MM-dd"
  );

  try {
    const response = await axios.get(
      `${WEATHER_URL}&start_date=${fromDateFormatted}&end_date=${toDateFormatted}`
    );

    return response.data;
  } catch (error) {
    toastError({
      title: WEB_MESSAGE.COMMON_ERROR,
    });

    throw Error();
  }
};

export const fetchTodayWeather = async () => {
  const fromDateFormatted = format(new Date(), "yyyy-MM-dd");
  const toDateFormatted = format(new Date(), "yyyy-MM-dd");

  try {
    const response: AxiosResponse<WeatherAPIResponse> = await axios.get(
      `${WEATHER_URL}&start_date=${fromDateFormatted}&end_date=${toDateFormatted}`
    );

    return response.data;
  } catch (error) {
    toastError({
      title: WEB_MESSAGE.COMMON_ERROR,
    });

    return {};
  }
};
