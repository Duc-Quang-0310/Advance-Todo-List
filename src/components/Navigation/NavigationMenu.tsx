import { Box, Image, Text, Icon } from "@chakra-ui/react";
import { FC, Suspense, useCallback, useMemo } from "react";
import { Outlet } from "react-router";
import {
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineUnorderedList,
  AiOutlineDashboard,
} from "react-icons/ai";

import { LOGO } from "../../images/images.const";
import { useBrowser } from "../../hooks/useBrowser";
import BasicContainer from "../Container/BasicContainer";
import { MenuItem } from "../../constants/utils.const";
import { PATH } from "../../constants/path.const";
import useAccountStore from "../../zustand/useAccountStore";
import s from "./navigation.module.css";
import LoadingFallBack from "../LoadingFallBack/LoadingFallBack";
import AppHeader from "../Header/AppHeader";

const NavigationMenu: FC = () => {
  const {
    pushHome,
    pathname,
    pushSignIn,
    pushDashboard,
    pushTodo,
    pushProfile,
  } = useBrowser();
  const clearAccount = useAccountStore((state) => state.clearAccountStore);

  const handleLogout = useCallback(() => {
    clearAccount();
    setTimeout(pushSignIn, 400);
  }, [clearAccount, pushSignIn]);

  const MenuItems: MenuItem[] = useMemo(
    () => [
      {
        label: "Trang chủ",
        isActive: pathname === PATH.HOME || false,
        onClick() {
          if (pathname !== PATH.HOME) {
            pushHome();
          }
        },
        icon: (
          <Icon
            as={AiOutlineHome}
            w="20px"
            h="20px"
            color={pathname === PATH.HOME ? "green.900" : "blackAlpha.800"}
          />
        ),
      },
      {
        label: "Thống kê",
        isActive: pathname?.includes(PATH.DASHBOARD) || false,
        onClick() {
          if (pathname !== PATH.DASHBOARD) {
            pushDashboard();
          }
        },
        icon: (
          <Icon
            as={AiOutlineDashboard}
            w="20px"
            h="20px"
            color={
              pathname?.includes(PATH.DASHBOARD)
                ? "green.900"
                : "blackAlpha.800"
            }
          />
        ),
      },
      {
        label: "Việc cần làm",
        isActive: pathname?.includes(PATH.TODO) || false,
        onClick() {
          if (pathname !== PATH.TODO) {
            pushTodo();
          }
        },
        icon: (
          <Icon
            as={AiOutlineUnorderedList}
            w="20px"
            h="20px"
            color={
              pathname?.includes(PATH.TODO) ? "green.900" : "blackAlpha.800"
            }
          />
        ),
      },
      {
        label: "Thông tin cá nhân",
        isActive: pathname?.includes(PATH.USER_PROFILE) || false,
        onClick() {
          if (pathname !== PATH.USER_PROFILE) {
            pushProfile();
          }
        },
        icon: (
          <Icon
            as={AiOutlineUser}
            w="20px"
            h="20px"
            color={
              pathname?.includes(PATH.USER_PROFILE)
                ? "green.900"
                : "blackAlpha.800"
            }
          />
        ),
      },
      {
        label: "Đăng xuất",
        isActive: false,
        onClick: handleLogout,
        icon: <Icon as={AiOutlineLogout} w="20px" h="20px" />,
      },
    ],
    [handleLogout, pathname, pushDashboard, pushHome, pushProfile, pushTodo]
  );

  return (
    <BasicContainer display="flex">
      <Box
        width="240px"
        borderRight="3px solid RGBA(0, 0, 0, 0.16)"
        boxShadow="inner"
        px="3"
        py="5"
        background="blackAlpha.100"
        display="flex"
        flexDirection="column"
        tabIndex={0}
      >
        <Box
          data-display="Logo-block"
          display="flex"
          onClick={pushHome}
          alignItems="center"
          px="3"
          mt="1"
          cursor="pointer"
        >
          <Box boxSize="30px">
            <Image src={LOGO} alt="App Logo" loading="eager" />
          </Box>
          <Box ml="4">
            <Text fontSize="14px" fontWeight="600">
              Website: Tu đu lít
            </Text>
            <Text fontSize="12px">Dự án cá nhân</Text>
          </Box>
        </Box>

        <Box flex="1" pt="5" display="flex" flexDirection="column" gap="3">
          {MenuItems.map(
            ({ icon, isActive = false, label, onClick }, index) => (
              <Box
                display="flex"
                key={label}
                cursor="pointer"
                alignItems="center"
                p="2"
                background={isActive ? "green.200" : "-moz-initial"}
                onClick={onClick}
                borderRadius="5"
                mt={index === MenuItems?.length - 1 ? "auto" : "-moz-initial"}
                position="relative"
                className={isActive ? s.activeNavBlock : undefined}
                transition="all 0.1s ease-in"
                tabIndex={0}
              >
                <Box boxSize="24px" mx="2" display="flex" alignItems="center">
                  {icon}
                </Box>
                <Text
                  fontSize="14px"
                  userSelect="none"
                  color={isActive ? "green.600" : "RGBA(0, 0, 0, 0.70)"}
                  fontWeight={isActive ? "600" : "normal"}
                >
                  {label}
                </Text>
              </Box>
            )
          )}
        </Box>
        <Text
          textAlign="center"
          fontSize="12px"
          borderTop="2px solid RGBA(0, 0, 0, 0.16)"
          paddingTop="40px"
          userSelect="none"
        >
          Kỷ luật giúp tạo nên thành công, hãy quản lý công việc của bạn hợp lý
        </Text>
      </Box>
      <Box flex={1}>
        <AppHeader />
        <Box height="calc(100vh - 40px)" width="calc(100vw - 240px)">
          <Suspense fallback={<LoadingFallBack />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </BasicContainer>
  );
};

export default NavigationMenu;
