import { createStandaloneToast } from "@chakra-ui/toast";

const { toast } = createStandaloneToast();

interface ToastInput {
  title: string;
  description?: string;
  duration?: number;
}

export const toastSuccess = ({ title, description, duration }: ToastInput) =>
  toast({
    title,
    description,
    status: "success",
    duration: duration ? duration * 1000 : 5000,
    isClosable: true,
  });
export const toastError = ({ title, description, duration }: ToastInput) =>
  toast({
    title,
    description,
    status: "error",
    duration: duration ? duration * 1000 : 5000,
    isClosable: true,
  });

export const toastInfo = ({ title, description, duration }: ToastInput) =>
  toast({
    title,
    description,
    status: "info",
    duration: duration ? duration * 1000 : 5000,
    isClosable: true,
  });
