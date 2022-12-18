import { useForm, Controller } from "react-hook-form";
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
import { useLayoutEffect } from "react";

import AuthForm from "../../components/AuthForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../constants/validate.const";
import { LoginBody } from "../../zustand/type";
import Logo from "../../../public/todolist.jpg";

import s from "./Signin.module.css";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/path.const";
import useAccountStore from "../../zustand/useAccountStore";

const SignIn = () => {
  const login = useAccountStore((state) => state.login);
  const controls = useAnimationControls();

  const initPlace = {
    transform: "translateY(-600px)",
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginBody>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitLogin = (body: LoginBody) => login(body);

  useLayoutEffect(() => {
    controls.start((i) => ({
      transform: "translateY(0px)",
      transition: { delay: i * 0.1, duration: i * 0.2 },
    }));
  }, [controls]);

  return (
    <AuthForm>
      <section className={s.form}>
        <motion.div initial={initPlace} custom={6} animate={controls}>
          <Image
            borderRadius="full"
            boxSize="70px"
            src={Logo}
            alt="Tu đu lít"
          />
          <Text fontSize="md" textAlign="left" opacity={0.6} fontWeight={600}>
            Chào mừng quay trở lại Tu đu lít
          </Text>
        </motion.div>
        <Stack spacing={4} direction="column">
          <Controller
            name="email"
            control={control}
            render={({ field: { name, onChange, ref } }) => (
              <motion.div initial={initPlace} custom={5} animate={controls}>
                <FormControl isInvalid={!!errors?.email}>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    name={name}
                    onChange={onChange}
                    ref={ref}
                    key={name}
                    size="md"
                  />
                  {errors?.email ? (
                    <FormErrorMessage>
                      {errors?.email?.message}
                    </FormErrorMessage>
                  ) : null}
                </FormControl>
              </motion.div>
            )}
          />

          <Controller
            name="password"
            key="password"
            control={control}
            render={({ field: { name, onChange, ref } }) => (
              <motion.div initial={initPlace} custom={4} animate={controls}>
                <FormControl isInvalid={!!errors?.password}>
                  <FormLabel>Mật khẩu</FormLabel>
                  <Input
                    type="password"
                    name={name}
                    onChange={onChange}
                    ref={ref}
                    key={name}
                    size="md"
                  />
                  {errors?.password ? (
                    <FormErrorMessage>
                      {errors?.password?.message}
                    </FormErrorMessage>
                  ) : null}
                </FormControl>
              </motion.div>
            )}
          />
          <motion.div
            className={s.additionalBox}
            initial={initPlace}
            custom={3}
            animate={controls}
          >
            <Checkbox size="md" colorScheme="teal">
              Ghi nhớ đăng nhập
            </Checkbox>
            <Link to={PATH.PSW_RECOVER} className={s.redirect}>
              Lấy lại mật khẩu
            </Link>
          </motion.div>

          <motion.div initial={initPlace} custom={2} animate={controls}>
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleSubmit(handleSubmitLogin)}
              width="100%"
            >
              Đăng nhập
            </Button>
          </motion.div>

          <motion.div initial={initPlace} custom={1} animate={controls}>
            <Button colorScheme="teal" variant="outline" width="100%">
              Đăng nhập với Google
            </Button>
          </motion.div>

          <motion.div initial={initPlace} custom={0} animate={controls}>
            <Text fontSize="sm" textAlign="center">
              Chưa có tài khoản hãy{" "}
              <Link to={PATH.SIGN_UP} className={s.redirect}>
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
