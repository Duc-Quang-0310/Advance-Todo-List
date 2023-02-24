import { Box, Icon, Image, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { FC, useCallback, useEffect, useMemo } from "react";
import { IoMdNotifications } from "react-icons/io";
import { imgLink } from "../../constants/image.const";
import { queryKey } from "../../constants/message.const";
import { PATH } from "../../constants/path.const";
import { fetchTodayWeather } from "../../helper/thirdParty.helper";
import { useBrowser } from "../../hooks/useBrowser";

import { LOGO } from "../../images/images.const";
import useAccountStore from "../../zustand/useAccountStore";
import s from "./AppHeader.module.css";

const AppHeader: FC = () => {
  const userInfo = useAccountStore((state) => state.userInfo);
  const { pathname } = useBrowser();
  const { data: weatherToday, mutate: getDailyWeather } = useMutation({
    mutationKey: [queryKey.WEATHER_FORECAST_DAY],
    mutationFn: fetchTodayWeather,
  });

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

  const title = useMemo(() => {
    if (pathname === PATH.HOME) {
      return "Trang chủ";
    }
    if (pathname === PATH.DASHBOARD) {
      return "Thống kê";
    }
    if (pathname === PATH.TODO || pathname === PATH.TODO_DETAIL) {
      return "Việc cần làm";
    }
    if (pathname === PATH.USER_PROFILE || pathname === PATH.USER_CUSTOMIZE) {
      return "Thông tin cá nhân";
    }
    return "";
  }, [pathname]);

  const temparatureToday = useMemo(
    () =>
      Math.round(
        (weatherToday?.hourly?.temperature_2m?.reduce(
          (prevTemp, nextTemp) => prevTemp + nextTemp,
          0
        ) || 0) / 24
      ),
    [weatherToday?.hourly?.temperature_2m]
  );

  const rainPercent = useMemo(
    () =>
      (weatherToday?.hourly?.rain?.reduce(
        (prevTemp, nextTemp) => prevTemp + nextTemp,
        0
      ) || 0) / 24,

    [weatherToday?.hourly?.rain]
  );

  useEffect(() => {
    if (!weatherToday) {
      getDailyWeather(new Date());
    }
  }, [getDailyWeather, weatherToday]);

  return (
    <Box
      background="green.500"
      height="40px"
      display="flex"
      alignItems="center"
      px="6"
      justifyContent="space-between"
    >
      <Box display="flex" flexDirection="row" gap="5">
        <Image
          src={userInfo?.avatar || LOGO}
          alt="App Logo"
          loading="eager"
          rounded="full"
          objectFit="cover"
          boxSize="26px"
        />
        <Box className={s.hoverItem} rounded="full">
          <Icon
            as={IoMdNotifications}
            color="white"
            height="22px"
            width="22px"
          />
        </Box>
      </Box>
      <Box background="white" px="2" borderRadius="5" display="flex" py="0.5">
        <Image
          src={renderImgSource(rainPercent)}
          loading="eager"
          rounded="full"
          boxSize="26px"
          mr="2"
        />
        <Text fontWeight="600" fontSize="18px" color="green.400">
          {temparatureToday || "..."} °C
        </Text>
      </Box>
      <Text
        textTransform="uppercase"
        fontWeight="600"
        letterSpacing="1px"
        color="white"
        className={s.hoverTitle}
      >
        {title}
      </Text>
    </Box>
  );
};

export default AppHeader;
