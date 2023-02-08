import { Box, Spinner } from "@chakra-ui/react";

const LoadingFallBack = () => (
  <Box
    width="100%"
    justifyContent="center"
    display="flex"
    alignItems="center"
    height="calc(100vh - 40px)"
  >
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="green.500"
      size="xl"
    />
  </Box>
);

export default LoadingFallBack;
