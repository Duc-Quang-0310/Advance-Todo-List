import {
  Button,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  forwardRef,
  createRef,
  useImperativeHandle,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import { useWindowListener } from "../../hooks/useWindowListener";
import useAccountStore from "../../zustand/useAccountStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginByPhoneBody,
  loginByPhoneSchema,
} from "../../constants/validate.const";

import s from "./Signin.module.css";
import { ConfirmationResult } from "firebase/auth";
import { useBrowser } from "../../hooks/useBrowser";

type ModalRef = {
  showMobileSignInModal: () => void;
};

const SignInPhoneNumberComponent = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    showMobileSignInModal: () => {
      onOpen();
    },
  }));
  const { pushHome } = useBrowser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConfirmationResult | null>();
  const loginWithPhoneNumber = useAccountStore(
    (state) => state.loginWithPhoneNumber
  );
  const resErr = useAccountStore((state) => state.errors);
  const verificationLoginPhone = useAccountStore(
    (state) => state.verificationLoginPhone
  );

  const submitRef = useRef<HTMLButtonElement>(null);

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    clearErrors,
    setError,
  } = useForm<LoginByPhoneBody>({
    mode: "all",
    resolver: zodResolver(loginByPhoneSchema),
    defaultValues: {
      telephone: "",
      verifyCode: "",
    },
  });

  const telephoneWatch = watch("telephone");
  const codeWatch = watch("verifyCode");

  const handleCloseModal = useCallback(() => {
    onClose();
    clearErrors();
  }, [onClose, clearErrors]);

  const handleSubmitForm = useCallback(
    async (data: LoginByPhoneBody) => {
      setLoading(true);
      if (!result) {
        const confirmRes = await loginWithPhoneNumber(data);
        if (confirmRes) {
          setResult(confirmRes);
        }
      } else {
        if (!codeWatch) {
          setLoading(false);
          return setError("verifyCode", {
            message: "M?? x??c nh???n kh??ng ???????c ????? tr???ng",
          });
        }

        const res = await result.confirm(String(data?.verifyCode));
        verificationLoginPhone(res.user, () => setTimeout(pushHome, 400));
      }
      setLoading(false);
    },
    [
      codeWatch,
      loginWithPhoneNumber,
      pushHome,
      result,
      setError,
      verificationLoginPhone,
    ]
  );

  useWindowListener((e) => {
    if (e.code === "Enter") {
      submitRef?.current?.click?.();
    }
  }, "keydown");

  const renderContextError = useCallback(
    (field: keyof LoginByPhoneBody) =>
      errors?.[field] ? (
        <FormErrorMessage>{errors?.[field]?.message}</FormErrorMessage>
      ) : null,
    [errors]
  );

  useEffect(() => {
    if (resErr && resErr.includes("S??? ??i???n tho???i")) {
      setError("telephone", { message: resErr });
    }
  }, [clearErrors, resErr, setError]);

  return (
    <Modal closeOnOverlayClick isOpen={isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>????ng nh???p b???ng s??? ??i???n tho???i</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={3}>
          <Stack spacing={2} direction="column">
            <FormControl isInvalid={!!errors?.telephone}>
              <FormLabel htmlFor="telephone">S??? ??i???n tho???i</FormLabel>
              <InputGroup>
                <InputLeftAddon children="+84" />
                <Input
                  id="telephone"
                  disabled={loading}
                  size="md"
                  {...register("telephone")}
                />
              </InputGroup>
              {renderContextError("telephone")}
            </FormControl>

            <Collapse in={!!telephoneWatch && !!result} animateOpacity>
              <FormControl isInvalid={!!errors?.verifyCode}>
                <FormLabel htmlFor="verifyCode">M?? x??c nh???n</FormLabel>
                <Input
                  id="verifyCode"
                  disabled={loading}
                  size="md"
                  {...register("verifyCode")}
                />
                {renderContextError("verifyCode")}
              </FormControl>
            </Collapse>
          </Stack>
        </ModalBody>

        {!!result ? null : (
          <div id="capchaContainer" className={s.mobileMethod} />
        )}

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleSubmit(handleSubmitForm)}
            ref={submitRef}
            disabled={loading}
          >
            {!!telephoneWatch && !!result ? "????ng nh???p" : "Ti???p"}
          </Button>
          <Button onClick={handleCloseModal} disabled={loading}>
            H???y
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

const modalRef = createRef<ModalRef>();

export const SignInMobileModal = () => (
  <SignInPhoneNumberComponent ref={modalRef} />
);

export const showSignInMobileModal = () => {
  modalRef?.current?.showMobileSignInModal();
};
