import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import cx from "clsx";
import { useAnimationControls, motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import { PATH } from "../../constants/path.const";
import { initPlace } from "../../constants/utils.const";
import { PSWRecoverSchema } from "../../constants/validate.const";
import { useBrowser } from "../../hooks/useBrowser";
import { LOGO } from "../../images/images.const";
import { LoginBody } from "../../zustand/type";
import useAccountStore from "../../zustand/useAccountStore";

import s from "../sign-in/Signin.module.css";

const PSWRecover = () => {
  const controls = useAnimationControls();
  const loading = useAccountStore((state) => state.loading);
  const googleSignin = useAccountStore((state) => state.googleSignin);
  const resErr = useAccountStore((state) => state.errors);
  const clearErrors = useAccountStore((state) => state.clearErrors);
  const requestPasswordReset = useAccountStore(
    (state) => state.requestPasswordReset
  );
  const { pushHome } = useBrowser();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
  } = useForm<Pick<LoginBody, "email">>({
    mode: "all",
    resolver: zodResolver(PSWRecoverSchema),
    defaultValues: {
      email: "",
    },
  });

  const renderContextError = useCallback(
    (field: keyof Pick<LoginBody, "email">) =>
      errors?.[field] ? (
        <FormErrorMessage>{errors?.[field]?.message}</FormErrorMessage>
      ) : null,
    [errors]
  );

  const handlePSWRecover = useCallback(
    (data: Pick<LoginBody, "email">) => {
      requestPasswordReset(data);
    },
    [requestPasswordReset]
  );

  useLayoutEffect(() => {
    controls.start((i) => ({
      transform: "translateY(0px)",
      transition: { delay: i * 0.2, duration: i * 0.3 },
    }));
  }, [controls]);

  useEffect(() => {
    if (resErr && resErr.includes("Email")) {
      setError("email", {
        message: resErr,
      });
    }

    return () => {
      clearErrors();
    };
  }, [clearErrors, resErr, setError]);

  return (
    <AuthForm>
      <section className={s.form}>
        <motion.div initial={initPlace} custom={4} animate={controls}>
          <Image
            borderRadius="full"
            boxSize="70px"
            src={LOGO}
            alt="Tu ??u l??t"
          />
          <Text fontSize="md" textAlign="left" opacity={0.6} fontWeight={600}>
            T??m l???i t??i kho???n t???i Tu ??u l??t
          </Text>
        </motion.div>
        <Stack spacing={4} direction="column">
          <motion.div initial={initPlace} custom={3} animate={controls}>
            <FormControl isInvalid={!!errors?.email} mb={3}>
              <FormLabel htmlFor="email"> Email</FormLabel>
              <Input id="email" type="email" size="md" {...register("email")} />
              {renderContextError("email")}
            </FormControl>
          </motion.div>

          <motion.div initial={initPlace} custom={2} animate={controls}>
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleSubmit(handlePSWRecover)}
              width="100%"
              disabled={loading}
            >
              L???y l???i m???t kh???u
            </Button>
          </motion.div>

          <motion.div initial={initPlace} custom={1} animate={controls}>
            <Button
              colorScheme="teal"
              variant="outline"
              width="100%"
              disabled={loading}
              onClick={() => googleSignin(() => setTimeout(pushHome, 400))}
            >
              ????ng nh???p v???i Google
            </Button>
          </motion.div>

          <motion.div initial={initPlace} custom={0} animate={controls}>
            <Text fontSize="sm" textAlign="center">
              Ch??a c?? t??i kho???n h??y{" "}
              <Link
                to={PATH.SIGN_UP}
                className={cx(s.redirect, { [s.disableLink]: loading })}
              >
                ????ng k??
              </Link>
            </Text>
          </motion.div>
        </Stack>
      </section>
    </AuthForm>
  );
};

export default PSWRecover;
