import { Box, Spinner } from "@chakra-ui/react";

const LoadingFallBack = () => {
  return (
    <Box
      width="100%"
      justifyContent="center"
      display="flex"
      alignItems="center"
      height="100vh"
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
};

export default LoadingFallBack;
