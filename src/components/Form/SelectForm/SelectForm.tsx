import {
  Box,
  ChakraComponent,
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/react";
import { FC, useCallback } from "react";
import { UseFormRegister } from "react-hook-form";

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface Props {
  errMessage?: string;
  register: UseFormRegister<any>;
  label: string;
  isRequired?: boolean;
  name: string;
  displayType?: "inline" | "block";
  options: SelectOption[];
}

type SelectFormType = ChakraComponent<"input", Props>;

const SelectForm: FC<Props> = ({
  errMessage,
  register,
  label,
  isRequired = false,
  name,
  displayType = "block",
  options = [],
  ...other
}) => {
  const renderRequired = useCallback(
    (label: string) => (
      <Box display="flex" fontSize="14px">
        <Text color="blackAlpha.600">{label}</Text>
        <Text color="red.400" fontWeight="bold" ml="3px">
          *
        </Text>
      </Box>
    ),
    []
  );
  return (
    <>
      <FormControl isInvalid={!!errMessage} display="flex">
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
        <Select
          id={name}
          errorBorderColor="red.400"
          color="blackAlpha.700"
          {...other}
          {...register(name)}
        >
          {options.length > 0 &&
            options.map((option) => (
              <option
                value={option.value}
                key={option.value}
                disabled={option.disabled || false}
              >
                {option.label}
              </option>
            ))}
        </Select>
      </FormControl>
      {errMessage ? (
        <Text fontSize="12px" fontWeight="bold" color="red.400" textAlign="end">
          {errMessage}
        </Text>
      ) : null}
    </>
  );
};

export default SelectForm as SelectFormType;
