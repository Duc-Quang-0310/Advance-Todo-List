import { Box, Button, Kbd, SlideFade, Text } from "@chakra-ui/react";
import {
  FC,
  useMemo,
  CSSProperties,
  useCallback,
  KeyboardEvent,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordVerification from "../../../sign-up/PasswordVerification";
import { useBrowser } from "../../../../hooks/useBrowser";
import useAccountStore from "../../../../zustand/useAccountStore";
import {
  ChangePasswordSchema,
  ChangePasswordForm,
} from "../../../../constants/validate.const";
import InputForm from "../../../../components/Form/InputForm/InputForm";
import { TabIdentify } from "../../UserProfile";

interface Props {
  setTab: Dispatch<SetStateAction<TabIdentify>>;
}

const highLightText: CSSProperties = {
  fontWeight: 700,
  color: "#276749",
};

const ChangePass: FC<Props> = ({ setTab }) => {
  const userInfo = useAccountStore((state) => state.userInfo);
  const loading = useAccountStore((state) => state.loading);
  const storeErr = useAccountStore((state) => state.errors);
  const clearErrors = useAccountStore((state) => state.clearErrors);
  const changePassword = useAccountStore((state) => state.changePassword);
  const { pushHome } = useBrowser();

  const isGoogleOrPhoneLogin = useMemo(
    () =>
      userInfo?.provider?.data?.findIndex((provider) =>
        ["google.com", "phone"].includes(provider?.providerId)
      ),
    [userInfo?.provider?.data]
  );

  const {
    handleSubmit,
    formState: { errors, isDirty },
    register,
    watch,
    setError,
    reset,
  } = useForm<ChangePasswordForm>({
    mode: "all",
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordWatch = watch("password");

  const handleChangePassword = useCallback(
    (data: ChangePasswordForm) => {
      const { password, oldPassword, confirmPassword } = data;

      if (password !== confirmPassword) {
        return setError("confirmPassword", {
          message: "Mật khẩu xác nhận không đúng",
        });
      }

      changePassword({ password, oldPassword }, () => {
        setTab(TabIdentify.Profile);
        reset(
          {},
          {
            keepValues: false,
            keepErrors: false,
          }
        );
      });
    },
    [changePassword, setError, setTab, reset]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit(handleChangePassword)();
      }
    },
    [handleChangePassword, handleSubmit]
  );

  useEffect(() => {
    if (storeErr) {
      setError("oldPassword", {
        message: storeErr,
      });
    }
  }, [setError, storeErr]);

  useEffect(
    () => () => {
      clearErrors();
    },
    [clearErrors]
  );

  if (isGoogleOrPhoneLogin !== -1) {
    return (
      <SlideFade in>
        <Box
          bg="gray.50"
          color="blackAlpha.800"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt="10"
        >
          <Kbd fontSize="120px">403</Kbd>
          <Text fontSize="16px" mt="7" textAlign="center">
            Với tài khoản đăng nhập qua{" "}
            <span style={highLightText}>Google</span> và{" "}
            <span style={highLightText}>Điện thoại</span> <br /> chúng tôi không
            hỗ trợ đổi mật khẩu
          </Text>

          <Button
            mt="4"
            background="green.500"
            color="white"
            onClick={pushHome}
          >
            Quay về Trang chính
          </Button>
        </Box>
      </SlideFade>
    );
  }

  return (
    <SlideFade in>
      <Box display="flex" px="20" mt="10">
        <Box width="450px">
          <Text fontWeight="600" fontSize="3xl" mb="3" color="blackAlpha.600">
            Thay đổi mật khẩu
          </Text>
          <Text fontWeight="500" fontSize="md" mb="6" color="blackAlpha.600">
            Mật khẩu phải thỏa mãn các điều kiện dưới dây:
          </Text>
          <PasswordVerification password={passwordWatch} defaultShow />
        </Box>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          bg="white"
          boxShadow="md"
          p="7"
          borderRadius="md"
        >
          <InputForm
            errMessage={errors?.oldPassword?.message}
            register={register}
            label="Mật khẩu cũ"
            name="oldPassword"
            isRequired
            type="password"
          />
          <InputForm
            errMessage={errors?.password?.message}
            register={register}
            label="Mật khẩu mới"
            name="password"
            isRequired
            type="password"
          />
          <InputForm
            errMessage={errors?.confirmPassword?.message}
            register={register}
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            isRequired
            type="password"
            onKeyDown={handleKeyDown}
          />

          <Button
            ml="auto"
            colorScheme="green"
            px="4"
            mt="4"
            onClick={handleSubmit(handleChangePassword)}
            isLoading={loading}
            disabled={!isDirty}
          >
            Xác nhận
          </Button>
        </Box>
      </Box>
    </SlideFade>
  );
};

export default ChangePass;
