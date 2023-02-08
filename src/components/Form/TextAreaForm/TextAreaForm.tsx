import { FormControl, FormLabel, Textarea, Text, Box } from "@chakra-ui/react";
import { FC, useCallback } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
  errMessage?: string;
  register: UseFormRegister<any>;
  label: string;
  isRequired?: boolean;
  name: string;
  displayType?: "inline" | "block";
}

const TextAreaForm: FC<Props> = ({
  label,
  name,
  register,
  displayType,
  errMessage,
  isRequired,
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
        <Textarea
          id={name}
          size="md"
          errorBorderColor="red.400"
          color="blackAlpha.800"
          {...other}
          {...register(name)}
        />
      </FormControl>
      {errMessage ? (
        <Text fontSize="12px" fontWeight="bold" color="red.400" textAlign="end">
          {errMessage}
        </Text>
      ) : null}
    </>
  );
};

export default TextAreaForm;
