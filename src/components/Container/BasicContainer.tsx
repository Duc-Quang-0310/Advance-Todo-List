import { Box, ChakraComponent } from "@chakra-ui/react";
import { ReactNode, FC } from "react";

type DivComponent = ChakraComponent<"div", {}>;
interface Props {
  children?: ReactNode;
}

const BasicContainer: FC<Props> = ({ children, ...other }) => (
  <Box className="basicWrapper" bg="gray.50" color="blackAlpha.800" {...other}>
    {children}
  </Box>
);

export default BasicContainer as DivComponent;
