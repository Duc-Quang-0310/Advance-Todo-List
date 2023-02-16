import { Box, ChakraComponent, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

export type ColorSchema =
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "orange"
  | "pink"
  | "purple";

interface UserTabProps {
  colorSchema?: ColorSchema;
  icon: ReactNode;
  title: string;
}

type BoxElements = ChakraComponent<"input", UserTabProps>;

const UserTab: FC<UserTabProps> = ({
  colorSchema = "green",
  icon,
  title,
  ...other
}) => {
  return (
    <Box
      borderWidth="1px"
      borderStyle="solid"
      borderColor={`${colorSchema}.100`}
      display="flex"
      backgroundColor={`${colorSchema}.400`}
      borderRadius="lg"
      boxShadow="lg"
      color="white"
      alignItems="center"
      h="100px"
      minW="340px"
      cursor="pointer"
      {...other}
    >
      <Box w="100px" h="100%" p="4">
        <Box
          rounded="full"
          background="white"
          h="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {icon}
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Text fontSize="xl" fontWeight="600" textAlign="left" userSelect="none">
          {title}
        </Text>
      </Box>
    </Box>
  );
};

export default UserTab as BoxElements;
