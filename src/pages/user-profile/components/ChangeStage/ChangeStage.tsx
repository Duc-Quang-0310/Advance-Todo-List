import { SlideFade, Box } from "@chakra-ui/react";
import { FC } from "react";

const ChangeStage: FC = () => {
  return (
    <SlideFade in>
      <Box display="flex" px="20" mt="10">
        Change Stage
      </Box>
    </SlideFade>
  );
};

export default ChangeStage;
