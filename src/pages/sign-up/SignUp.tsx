import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Image,
  Stack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from "@chakra-ui/react";
import { useCallback, useEffect, useLayoutEffect } from "react";
import cx from "clsx";
import { useAnimationControls, motion } from "framer-motion";

import AuthForm from "../../components/AuthForm";
import { LOGO } from "../../images/images.const";
import s from "./SignUp.module.css";
import { SignUpBody, signUpSchema } from "../../constants/validate.const";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/path.const";
import useAccountStore from "../../zustand/useAccountStore";
import PasswordVerification from "./PasswordVerification";
import { initPlace } from "../../constants/utils.const";

const SignUp = () => {
  const controls = useAnimationControls();
  const createAccount = useAccountStore((state) => state.createAccount);
  const clearErrors = useAccountStore((state) => state.clearErrors);
  const googleSignin = useAccountStore((state) => state.googleSignin);
  const resError = useAccountStore((state) => state.errors);
  const loading = useAccountStore((state) => state.loading);

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setError,
  } = useForm<SignUpBody>({
    mode: "all",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordWatch = watch("password");

  const handleSignUp = (data: SignUpBody) => {
    const { confirmPassword, ...rest } = data;
    createAccount(rest);
  };

  const renderContextError = useCallback(
    (field: keyof SignUpBody) =>
      errors?.[field] ? (
        <FormErrorMessage>{errors?.[field]?.message}</FormErrorMessage>
      ) : null,
    [errors]
  );

  useLayoutEffect(() => {
    controls.start((i) => ({
      transform: "translateY(0px)",
      transition: { delay: i * 0.1, duration: i * 0.2 },
    }));
  }, [controls]);

  useEffect(() => {
    if (resError && resError.includes("Email đã tồn")) {
      setError("email", {
        message: resError,
      });
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
            Tạo tài khoản mới tại Tu đu lít
          </Text>
        </motion.div>
        <Stack spacing={4} direction="column">
          <motion.div initial={initPlace} custom={5} animate={controls}>
            <FormControl isInvalid={!!errors?.email}>
              <FormLabel htmlFor="email"> Email</FormLabel>
              <Input id="email" type="email" size="md" {...register("email")} />
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
                {...register("password")}
              />
            </FormControl>
          </motion.div>

          <motion.div initial={initPlace} custom={3} animate={controls}>
            <FormControl isInvalid={!!errors?.confirmPassword}>
              <FormLabel htmlFor="confirmPassword">Mật khẩu xác nhận</FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                size="md"
                {...register("confirmPassword")}
              />
              {renderContextError("confirmPassword")}
            </FormControl>
          </motion.div>

          <div>
            <PasswordVerification password={passwordWatch} />
          </div>

          <motion.div initial={initPlace} custom={2} animate={controls}>
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleSubmit(handleSignUp)}
              width="100%"
              disabled={loading}
            >
              Đăng ký
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
              Đã có tài khoản hãy{" "}
              <Link
                to={PATH.SIGN_IN}
                className={cx(s.redirect, { [s.disableLink]: loading })}
              >
                Đăng nhập
              </Link>
            </Text>
          </motion.div>
        </Stack>
      </section>
    </AuthForm>
  );
};

export default SignUp;
