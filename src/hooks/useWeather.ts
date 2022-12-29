import { useMutation, useQuery } from "@tanstack/react-query";

import { queryKey } from "./../constants/message.const";
import {
  fetchWeatherInRange,
  fetchTodayWeather,
} from "../helper/thirdParty.helper";

export const useWeather = () => {
  const { data: weatherToday, isLoading } = useQuery({
    queryKey: [queryKey.WEATHER_FORECAST_TODAY],
    queryFn: fetchTodayWeather,
  });

  const { data: dataWeatherByRange, mutate: getWeatherByRange } = useMutation({
    mutationKey: [queryKey.WEATHER_FORECAST_RANGE],
    mutationFn: fetchWeatherInRange,
  });

  return {
    weatherToday,
    dataWeatherByRange,
    isLoading,
    getWeatherByRange,
  };
};
