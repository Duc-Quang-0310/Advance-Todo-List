import { useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Button,
  Checkbox,
  Text,
  Image,
} from "@chakra-ui/react";
import { motion, useAnimationControls } from "framer-motion";
import { KeyboardEvent, useCallback, useEffect, useLayoutEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import cx from "clsx";

import AuthForm from "../../components/AuthForm";
import { loginSchema } from "../../constants/validate.const";
import { LoginBody } from "../../zustand/type";

import s from "./Signin.module.css";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/path.const";
import useAccountStore from "../../zustand/useAccountStore";
import { LOGO } from "../../images/images.const";

const SignIn = () => {
  const login = useAccountStore((state) => state.login);
  const clearErrors = useAccountStore((state) => state.clearErrors);
  const googleSignin = useAccountStore((state) => state.googleSignin);
  const loading = useAccountStore((state) => state.loading);
  const resError = useAccountStore((state) => state.errors);
  const controls = useAnimationControls();

  const initPlace = {
    transform: "translateY(-600px)",
  };

  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
  } = useForm<LoginBody>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitLogin = (body: LoginBody) => login(body);

  const renderContextError = useCallback(
    (field: keyof LoginBody) =>
      errors?.[field] ? (
        <FormErrorMessage>{errors?.[field]?.message}</FormErrorMessage>
      ) : null,
    [errors]
  );

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(handleSubmitLogin);
    }
  };

  useLayoutEffect(() => {
    controls.start((i) => ({
      transform: "translateY(0px)",
      transition: { delay: i * 0.1, duration: i * 0.2 },
    }));
  }, [controls]);

  useEffect(() => {
    if (resError) {
      if (resError.includes("Email")) {
        setError("email", {
          message: resError,
        });
      }

      if (resError.includes("Mật khẩu")) {
        setError("password", {
          message: resError,
        });
      }
    }

    return () => {
      clearErrors();
    };
  }, [clearErrors, resError, setError]);

  return (
    <AuthForm>
      <section className={s.form}>
        <motion.div initial={initPlace} custom={6} animate={controls}>
          <Image
            borderRadius="full"
            boxSize="70px"
            src={LOGO}
            alt="Tu đu lít"
          />
          <Text fontSize="md" textAlign="left" opacity={0.6} fontWeight={600}>
            Chào mừng quay trở lại Tu đu lít
          </Text>
        </motion.div>
        <Stack spacing={4} direction="column">
          <motion.div initial={initPlace} custom={5} animate={controls}>
            <FormControl isInvalid={!!errors?.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                disabled={loading}
                size="md"
                {...register("email")}
              />
              {renderContextError("email")}
            </FormControl>
          </motion.div>

          <motion.div initial={initPlace} custom={4} animate={controls}>
            <FormControl isInvalid={!!errors?.password}>
              <FormLabel htmlFor="password">Mật khẩu</FormLabel>
              <Input
                id="password"
                type="password"
                size="md"
                disabled={loading}
                {...register("password")}
                onKeyDown={handleEnter}
              />
              {renderContextError("password")}
            </FormControl>
          </motion.div>

          <motion.div
            className={s.additionalBox}
            initial={initPlace}
            custom={3}
            animate={controls}
          >
            <Checkbox size="md" colorScheme="teal" disabled={loading}>
              Ghi nhớ đăng nhập
            </Checkbox>
            <Link
              to={PATH.PSW_RECOVER}
              className={cx(s.redirect, { [s.disableLink]: loading })}
            >
              Lấy lại mật khẩu
            </Link>
          </motion.div>

          <motion.div initial={initPlace} custom={2} animate={controls}>
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleSubmit(handleSubmitLogin)}
              width="100%"
              disabled={loading}
            >
              Đăng nhập
            </Button>
          </motion.div>

          <motion.div initial={initPlace} custom={1} animate={controls}>
            <Button
              colorScheme="teal"
              variant="outline"
              width="100%"
              disabled={loading}
              onClick={googleSignin}
            >
              Đăng nhập với Google
            </Button>
          </motion.div>

          <motion.div initial={initPlace} custom={0} animate={controls}>
            <Text fontSize="sm" textAlign="center">
              Chưa có tài khoản hãy{" "}
              <Link
                to={PATH.SIGN_UP}
                className={cx(s.redirect, { [s.disableLink]: loading })}
              >
                Đăng ký
              </Link>
            </Text>
          </motion.div>
        </Stack>
      </section>
    </AuthForm>
  );
};

export default SignIn;
