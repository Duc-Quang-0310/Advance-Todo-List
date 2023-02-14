import { Box, Icon } from "@chakra-ui/react";
import { FC, lazy, useState, Suspense, useCallback } from "react";
import { CgProfile } from "react-icons/cg";
import { RiTimeLine } from "react-icons/ri";
import { MdTrackChanges } from "react-icons/md";

import UserTab, { ColorSchema } from "./components/UserTab/UserTab";
import LoadingFallBack from "../../components/LoadingFallBack/LoadingFallBack";
import s from "./UserProfile.module.css";

const InfoTab = lazy(() => import("./components/ChangeInfo/ChangeInfo"));
const StageTab = lazy(() => import("./components/ChangeStage/ChangeStage"));
const PasswordTab = lazy(
  () => import("./components/ChangePassword/ChangePass")
);

enum TabIdentify {
  Profile = "Profile",
  Stage = "Stage",
  Password = "Password",
}

const ALL_TABS = [
  {
    identify: TabIdentify.Profile,
    colorSchema: "blue",
    icon: <Icon as={CgProfile} color="blue.400" w="35px" h="35px" />,
    title: "Thông tin người dùng",
  },
  {
    identify: TabIdentify.Stage,
    colorSchema: "orange",
    icon: <Icon as={RiTimeLine} color="orange.400" w="35px" h="35px" />,
    title: "Tùy chỉnh giai đoạn",
  },
  {
    identify: TabIdentify.Password,
    colorSchema: "purple",
    icon: <Icon as={MdTrackChanges} color="purple.400" w="35px" h="35px" />,
    title: "Thay đổi mật khẩu",
  },
];

const UserProfile: FC = () => {
  const [tab, setTab] = useState<TabIdentify>(TabIdentify.Profile);

  const handleChangeTab = useCallback((tab: TabIdentify) => {
    switch (tab) {
      case TabIdentify.Profile:
        return <InfoTab />;
      case TabIdentify.Password:
        return <PasswordTab />;
      case TabIdentify.Stage:
        return <StageTab />;
      default:
        return null;
    }
  }, []);

  const handleClickOnTab = (tab: TabIdentify) => setTab(tab);

  return (
    <Box
      pt="4"
      px="3"
      height="100%"
      w="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        transition="all 0.3s ease-out"
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
      >
        {ALL_TABS.map(({ colorSchema, icon, identify, title }) => (
          <UserTab
            icon={icon}
            key={identify}
            title={title}
            colorSchema={colorSchema as ColorSchema}
            mb="3"
            mr="5"
            position="relative"
            onClick={() => handleClickOnTab(identify)}
            className={tab === identify ? s.activeTab : ""}
            transition="all 0.3s ease-in"
          />
        ))}
      </Box>
      <Suspense fallback={<LoadingFallBack height="500px" />}>
        <Box mt="3" flex={1} justifyContent="center" alignItems="center">
          {handleChangeTab(tab)}
        </Box>
      </Suspense>
    </Box>
  );
};

export default UserProfile;
