import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  ChakraComponent,
} from "@chakra-ui/react";
import { FC, HTMLInputTypeAttribute, useCallback } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
  errMessage?: string;
  register: UseFormRegister<any>;
  label: string;
  isRequired?: boolean;
  name: string;
  displayType?: "inline" | "block";
  type?: HTMLInputTypeAttribute;
  disable?: boolean;
}

type InputFormType = ChakraComponent<"input", Props>;

const InputForm: FC<Props> = ({
  errMessage,
  register,
  label,
  isRequired = false,
  name,
  displayType = "block",
  type,
  disable = false,
  ...other
}) => {
  const renderRequired = useCallback(
    (label: string) => (
      <Box display="flex" fontSize="15px">
        <Text color="blackAlpha.600">{label}</Text>
        <Text color="red.400" fontWeight="bold" ml="3px">
          *
        </Text>
      </Box>
    ),
    []
  );

  return (
    <Box mb="3">
      <FormControl
        isInvalid={!!errMessage}
        display={displayType === "inline" ? "flex" : "-moz-initial"}
      >
        <FormLabel
          htmlFor={name}
          w={displayType === "inline" ? "160px" : "initial"}
          display="flex"
          alignItems="center"
        >
          {!isRequired ? (
            <Text color="blackAlpha.600" fontSize="14px">
              {label}
            </Text>
          ) : (
            renderRequired(label)
          )}
        </FormLabel>
        <Input
          id={name}
          size="md"
          errorBorderColor="red.400"
          color="blackAlpha.700"
          type={type}
          {...register(name)}
          disabled={disable}
          {...other}
        />
      </FormControl>
      {errMessage ? (
        <Text
          fontSize="12px"
          fontWeight="bold"
          color="red.400"
          mt="2"
          textAlign="end"
        >
          {errMessage}
        </Text>
      ) : null}
    </Box>
  );
};

export default InputForm as InputFormType;
