import { Box, Button, Kbd, Text } from "@chakra-ui/react";
import { useBrowser } from "../../hooks/useBrowser";

const NotFoundPage = () => {
  const { pushHome } = useBrowser();
  return (
    <Box
      className="basicWrapper"
      bg="gray.50"
      color="blackAlpha.800"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Kbd fontSize="140px">404</Kbd>
      <Text fontSize="18px" fontWeight="600" mt="7" textAlign="center">
        Địa chỉ bạn điều hướng chúng tôi hiện không tìm thấy
      </Text>

      <Button mt="4" background="green.500" color="white" onClick={pushHome}>
        Quay về Trang chính
      </Button>
    </Box>
  );
};

export default NotFoundPage;
