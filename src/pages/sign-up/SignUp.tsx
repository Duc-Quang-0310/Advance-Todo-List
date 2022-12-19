import { useForm, Controller } from "react-hook-form";
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
import { startTransition, useCallback, useState } from "react";
import cx from "clsx";

import AuthForm from "../../components/AuthForm";
import { LOGO } from "../../images/images.const";
import s from "./SignUp.module.css";
import { SignUpBody, signUpSchema } from "../../constants/validate.const";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/path.const";
import useAccountStore from "../../zustand/useAccountStore";
import PasswordVerification from "./PasswordVerification";

const SignUp = () => {
  const createAccount = useAccountStore((state) => state.createAccount);
  const loading = useAccountStore((state) => state.loading);
  const [password, setPassword] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignUpBody>({
    mode: "all",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  return (
    <AuthForm>
      <section className={s.form}>
        <div>
          <Image
            borderRadius="full"
            boxSize="70px"
            src={LOGO}
            alt="Tu đu lít"
          />
          <Text fontSize="md" textAlign="left" opacity={0.6} fontWeight={600}>
            Tạo tài khoản mới tại Tu đu lít
          </Text>
        </div>
        <Stack spacing={4} direction="column">
          <Controller
            name="email"
            control={control}
            render={({ field: { name, onChange, ref } }) => (
              <div>
                <FormControl isInvalid={!!errors?.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name={name}
                    onChange={onChange}
                    ref={ref}
                    key={name}
                    size="md"
                  />
                  {renderContextError("email")}
                </FormControl>
              </div>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { name, onChange, ref } }) => (
              <div>
                <FormControl isInvalid={!!errors?.password}>
                  <FormLabel>Mật khẩu</FormLabel>
                  <Input
                    type="password"
                    name={name}
                    onChange={(e) => {
                      startTransition(() => setPassword(e.target.value));
                      onChange(e);
                    }}
                    ref={ref}
                    key={name}
                    size="md"
                  />
                </FormControl>
              </div>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { name, onChange, ref } }) => (
              <div>
                <FormControl isInvalid={!!errors?.confirmPassword}>
                  <FormLabel>Mật khẩu xác nhận</FormLabel>
                  <Input
                    type="password"
                    name={name}
                    onChange={onChange}
                    ref={ref}
                    key={name}
                    size="md"
                  />
                  {renderContextError("confirmPassword")}
                </FormControl>
              </div>
            )}
          />

          <div>
            <PasswordVerification password={password} />
          </div>

          <div>
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleSubmit(handleSignUp)}
              width="100%"
              disabled={loading}
            >
              Đăng ký
            </Button>
          </div>

          <div>
            <Button
              colorScheme="teal"
              variant="outline"
              width="100%"
              disabled={loading}
            >
              Đăng nhập với Google
            </Button>
          </div>

          <div>
            <Text fontSize="sm" textAlign="center">
              Đã có tài khoản hãy{" "}
              <Link
                to={PATH.SIGN_IN}
                className={cx(s.redirect, { [s.disableLink]: loading })}
              >
                Đăng nhập
              </Link>
            </Text>
          </div>
        </Stack>
      </section>
    </AuthForm>
  );
};

export default SignUp;
