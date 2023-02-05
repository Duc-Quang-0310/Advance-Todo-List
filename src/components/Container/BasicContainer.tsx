import { Box } from "@chakra-ui/react";
import { ReactNode, FC } from "react";

interface Props {
  children?: ReactNode;
}

const BasicContainer: FC<Props> = ({ children, ...other }) => (
  <Box
    className="basicWrapper"
    bg="gray.50"
    py="3.5"
    color="blackAlpha.800"
    {...other}
  >
    {children}
  </Box>
);

export default BasicContainer;
