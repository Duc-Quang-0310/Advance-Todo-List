import { ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Collapse, Text, ChakraComponent } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";

interface Props {
  title: string;
  element: ReactNode;
}

type DivComponent = ChakraComponent<"div", Props>;

const CollapseUI: FC<Props> = ({ element, title, ...other }) => {
  const [openChildren, setOpenChildren] = useState(false);
  return (
    <Box mt="4" {...other}>
      <Box
        onClick={() => setOpenChildren((prev) => !prev)}
        display="flex"
        alignItems="center"
        border="1px solid #48BB78"
        transition="all 0.2s ease-out"
        px="2"
        py="1"
        borderTopRadius="10"
        borderBottomRadius={!openChildren ? "10" : "0"}
        background={!openChildren ? "white" : "green.600"}
        cursor="pointer"
      >
        <Text
          userSelect="none"
          fontSize="14px"
          fontWeight={600}
          color={openChildren ? "white" : "green.600"}
        >
          {title}
        </Text>
        <ChevronUpIcon
          ml="auto"
          transition="all 0.2s ease-in"
          transform={openChildren ? "rotate(180deg)" : "rotate(0deg)"}
          color={openChildren ? "white" : "green.600"}
        />
      </Box>
      <Collapse in={openChildren}>
        <Box border="1px solid #48BB78" borderBottomRadius="10" px="4" py="4">
          {element}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CollapseUI as DivComponent;
