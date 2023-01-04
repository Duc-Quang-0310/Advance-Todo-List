import { useMutation } from "@tanstack/react-query";
import { add, isAfter } from "date-fns";
import { useEffect, useRef } from "react";

import { queryKey } from "./../constants/message.const";
import {
  fetchWeatherInRange,
  fetchTodayWeather,
} from "../helper/thirdParty.helper";

export const useWeather = (date: Date) => {
  const prevDate = useRef<Date>(new Date());

  const {
    data: weatherToday,
    isLoading: isLoadingDaily,
    mutate: getDailyWeather,
  } = useMutation({
    mutationKey: [queryKey.WEATHER_FORECAST_DAY],
    mutationFn: fetchTodayWeather,
  });

  const {
    data: weeklyWeather,
    mutate: getWeeklyWeather,
    isLoading: isLoadingWeekly,
  } = useMutation({
    mutationKey: [queryKey.WEATHER_FORECAST_RANGE],
    mutationFn: fetchWeatherInRange,
  });

  useEffect(() => {
    if (date) {
      getDailyWeather(date);

      const oneWeekFromPrevDate = add(prevDate.current, {
        days: 7,
      });

      if (prevDate.current && isAfter(date, oneWeekFromPrevDate)) {
        getWeeklyWeather({
          fromDate: date,
          toDate: oneWeekFromPrevDate,
        });
      }
    }

    return () => {
      prevDate.current = date;
    };
  }, [date, getDailyWeather, getWeeklyWeather]);

  useEffect(() => {
    if (date) {
      const oneWeekFromDefault = add(date, {
        days: 7,
      });

      getWeeklyWeather({
        fromDate: date,
        toDate: oneWeekFromDefault,
      });
    }
    // eslint-disable-next-line
  }, []);

  return {
    weatherToday,
    weeklyWeather,
    isLoadingDaily,
    isLoadingWeekly,
  };
};
