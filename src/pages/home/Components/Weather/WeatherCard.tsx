import { Box, Text, Image } from "@chakra-ui/react";
import { format } from "date-fns";
import { FC, useCallback } from "react";
import cx from "clsx";

import { imgLink } from "../../../../constants/image.const";

import s from "./weather.module.css";

interface Props {
  lowest: string | number;
  highest: string | number;
  rain: number;
  title: string;
  onClick?: () => void;
  focus?: boolean;
}

const WeatherCard: FC<Props> = ({
  highest,
  lowest,
  rain,
  title,
  onClick,
  focus = false,
}) => {
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

  return (
    <Box
      border="1px solid RGBA(0, 0, 0, 0.16)"
      padding={1}
      display="flex"
      flexDir="column"
      alignItems="center"
      onClick={onClick}
      cursor="pointer"
      minWidth={"60px"}
      className={cx(s.cardWeather, { [s.cardWeatherActive]: focus })}
    >
      <Text fontSize="xs" color={"RGBA(0, 0, 0, 0.64)"} fontWeight="600">
        {format(new Date(title), "MM-dd")}
      </Text>
      <Image src={renderImgSource(rain)} w="40px" h="40px" />
      <Text
        fontSize="x-small"
        color={"RGBA(0, 0, 0, 0.64)"}
        fontWeight="600"
      >{`${lowest}° - ${highest}°`}</Text>
    </Box>
  );
};

export default WeatherCard;
