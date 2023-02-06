import {
  Container,
  Box,
  Stack,
  Image,
  Text,
  Collapse,
  Button,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import { useWeather } from "../../../../hooks/useWeather";
import DateFilter, { MappedFilterFields } from "../DateFilter/DateFilter";
import { imgLink } from "../../../../constants/image.const";
import { format, startOfHour } from "date-fns";

import s from "./weather.module.css";
import WeatherCard from "./WeatherCard";
import {
  filteredWeatherDetail,
  FilteredWeatherDetail,
  renderBtnVariant,
  renderWeatherDisplayTitle,
} from "../../../../helper/render.helper";
import color from "../../../../constants/color.const";
import { InfoIcon } from "@chakra-ui/icons";
import RangeFilter from "./RangeFilter";

const Weather = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<MappedFilterFields>("day");
  const [dataDisplayFilter, setDataDisplayFilter] =
    useState<FilteredWeatherDetail>("temperature");
  const { weatherToday, weeklyWeather, isLoadingDaily } =
    useWeather(selectedDate);
  const [lineChart, setLineChart] = useState({
    step: 1,
    range: [0, 23],
  });

  const currentDateIndex = useMemo(() => {
    const convertedDate = format(selectedDate, "yyyy-MM-dd");
    const foundIndex = weeklyWeather?.daily?.time?.findIndex(
      (time) => time === convertedDate
    );

    if (foundIndex && ~foundIndex) return foundIndex;

    return 0;
  }, [weeklyWeather, selectedDate]);

  const renderImgSource = useCallback((rainPercent: number) => {
    if (rainPercent <= 100 && rainPercent > 50) {
      return imgLink.RAIN;
    }

    if (rainPercent <= 50 && rainPercent >= 10) {
      return imgLink.CLOUDY;
    }

    if (rainPercent < 10) {
      return imgLink.SUNNY;
    }

    return imgLink.SUNNY;
  }, []);

  const weatherInfo = useMemo(() => {
    const hourlyOfDaily = weatherToday?.hourly;
    const dateFormat = format(
      startOfHour(selectedDate),
      "yyyy-MM-dd HH:00"
    ).replace(" ", "T");

    const currentTimeInTimeArr = hourlyOfDaily?.time?.findIndex(
      (i) => i === dateFormat
    );

    const humidity =
      hourlyOfDaily?.relativehumidity_2m?.reduce(
        (prev, current) => prev + current,
        0
      ) || 0;

    const rain =
      hourlyOfDaily?.rain?.reduce((prev, current) => prev + current, 0) || 0;

    return {
      humidity: Math.round(
        humidity / (hourlyOfDaily?.relativehumidity_2m?.length || 1) || 0
      ),
      rain: Math.round(rain / (hourlyOfDaily?.rain?.length || 1) || 0),
      temperture: currentTimeInTimeArr
        ? hourlyOfDaily?.temperature_2m?.[currentTimeInTimeArr]
        : 0,
    };
  }, [selectedDate, weatherToday?.hourly]);

  const renderWholeWeek = useMemo(() => {
    const dailyOfWeeklyWeather = weeklyWeather?.daily;
    const rainSum = dailyOfWeeklyWeather?.rain_sum || [];
    const tempMax = dailyOfWeeklyWeather?.temperature_2m_max || [];
    const tempMin = dailyOfWeeklyWeather?.temperature_2m_min || [];
    const time = dailyOfWeeklyWeather?.time || [];

    const reSelectDate = (stringDate: string) => () => {
      if (stringDate) {
        const hour = format(new Date(), "yyyy-MM-dd HH:mm").split(" ")[1];
        const date = format(
          startOfHour(new Date(stringDate)),
          "yyyy-MM-dd HH:00"
        ).split(" ")[0];
        const formatedDate = new Date(`${date}T${hour}`);
        setSelectedDate(formatedDate);
      }
    };

    return (
      <Collapse
        in={!!dailyOfWeeklyWeather && !!dailyOfWeeklyWeather?.rain_sum?.length}
        animateOpacity
      >
        <Box display="flex" justifyContent="space-around">
          {dailyOfWeeklyWeather &&
            rainSum &&
            rainSum.map((_, index) => (
              <WeatherCard
                key={time?.[index]}
                highest={tempMax?.[index] || 0}
                lowest={tempMin?.[index] || 0}
                rain={rainSum?.[index] || 0}
                title={time?.[index] || ""}
                onClick={reSelectDate(time?.[index])}
                focus={
                  !!time?.[index] &&
                  format(selectedDate, "dd-MM-yyyy") ===
                    format(new Date(time?.[index]), "dd-MM-yyyy")
                }
              />
            ))}
        </Box>
      </Collapse>
    );
  }, [selectedDate, weeklyWeather?.daily]);

  const handleChangeDataDisplay = useCallback(
    (type: string) => () => {
      setDataDisplayFilter(type as FilteredWeatherDetail);
    },
    []
  );

  const weatherLineChart = useMemo(() => {
    let data,
      fillColor = color.visibility;
    const label = renderWeatherDisplayTitle(dataDisplayFilter);
    switch (dataDisplayFilter) {
      case "air":
        data = weatherToday?.hourly?.windspeed_10m || [];
        fillColor = color.visibility;
        break;
      case "humidity":
        data = weatherToday?.hourly?.relativehumidity_2m || [];
        fillColor = color.humidity;
        break;
      case "temperature":
        data = weatherToday?.hourly?.temperature_2m || [];
        fillColor = color.sunny;
        break;
      default:
        break;
    }

    const hourlyTime = weatherToday?.hourly?.time?.map((t) =>
      format(new Date(t), "H")
    );

    const indexRangeFoundArr = lineChart.range
      .map((mark) =>
        hourlyTime?.findIndex((time) => time === mark.toString(10))
      )
      ?.filter((i) => i !== undefined);

    const allowedStep =
      data?.map(
        (_, index) => Number(indexRangeFoundArr?.[0]) + lineChart.step * index
      ) || [];

    const finalData = data
      ?.map((each, index) => {
        if (
          index >= Number(indexRangeFoundArr?.[0]) &&
          index <= Number(indexRangeFoundArr?.[1]) &&
          allowedStep.includes(index)
        ) {
          return each;
        }
        return null;
      })
      ?.filter((i) => i !== null);

    const labels =
      hourlyTime &&
      [...hourlyTime]
        ?.map((each, index) => {
          if (
            index >= Number(indexRangeFoundArr?.[0]) &&
            index <= Number(indexRangeFoundArr?.[1]) &&
            allowedStep.includes(index)
          ) {
            return each;
          }
          return null;
        })
        ?.filter((i) => i !== null);

    return {
      labels,
      datasets: [
        {
          label,
          data: finalData,
          borderColor: fillColor,
          fill: fillColor,
        },
      ],
    };
  }, [
    dataDisplayFilter,
    lineChart.range,
    lineChart.step,
    weatherToday?.hourly?.relativehumidity_2m,
    weatherToday?.hourly?.temperature_2m,
    weatherToday?.hourly?.time,
    weatherToday?.hourly?.windspeed_10m,
  ]);

  return (
    <Container
      borderRadius={5}
      border="1px solid RGBA(0, 0, 0, 0.16)"
      paddingBlock={5}
      paddingInline={6}
      maxW="xl"
    >
      <Stack spacing={4}>
        <DateFilter
          title="Thời tiết"
          disableFields={["month", "year"]}
          filter={filter}
          onChangeFilter={setFilter}
        />
        <Box
          backgroundColor="RGBA(0, 0, 0, 0.02)"
          display="flex"
          padding={2}
          justifyContent="space-between"
        >
          <Box display="flex" gap={2} alignItems="center">
            <Image
              src={renderImgSource(weatherInfo.rain)}
              w="60px"
              h="60px"
              objectFit="cover"
            />
            <Text
              fontSize="3xl"
              fontWeight="700"
              color={"RGBA(0, 0, 0, 0.64)"}
              display="flex"
            >
              {isLoadingDaily ? "..." : weatherInfo.temperture}
              <Text
                fontSize="lg"
                fontWeight="700"
                color={"RGBA(0, 0, 0, 0.64)"}
              >
                °C
              </Text>
            </Text>

            <Box>
              <Text fontSize="xs" color="RGBA(0, 0, 0, 0.80)">
                Gió:{" "}
                {weeklyWeather?.daily?.windspeed_10m_max?.[currentDateIndex]}
                km/h
              </Text>
              <Text fontSize="xs" color="RGBA(0, 0, 0, 0.80)">
                Độ ẩm: {weatherInfo.humidity}%
              </Text>
              <Text fontSize="xs" color="RGBA(0, 0, 0, 0.80)">
                Khả năng có mưa: {weatherInfo.rain}%
              </Text>
            </Box>
          </Box>
          <Box>
            <Text
              textAlign="right"
              fontSize="xl"
              fontWeight="700"
              color="RGBA(0, 0, 0, 0.64)"
            >
              Hà Nội
            </Text>
            <Text textAlign="right" fontSize="small">
              {format(selectedDate, " dd/MM/yyyy kk:mm")}
            </Text>
            <Text textAlign="right" fontSize="small">
              Mùa đông ❄️
            </Text>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Stack direction="row" alignItems="center">
            {Object.keys(filteredWeatherDetail).map((key) => (
              <Button
                colorScheme="teal"
                variant={renderBtnVariant(key, dataDisplayFilter)}
                key={key}
                size="xs"
                onClick={handleChangeDataDisplay(key)}
              >
                {renderWeatherDisplayTitle(key as FilteredWeatherDetail)}
              </Button>
            ))}
          </Stack>

          <div>
            <RangeFilter
              trigger={<InfoIcon color="teal" cursor="pointer" />}
              setLineChart={setLineChart}
            />
          </div>
        </Box>

        <Box maxHeight="130px" className={s.chart}>
          <Line
            data={weatherLineChart}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
            }}
          />
        </Box>

        {renderWholeWeek}
      </Stack>
    </Container>
  );
};

export default Weather;
