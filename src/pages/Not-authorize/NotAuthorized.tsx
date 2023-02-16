import { Box, Button, Kbd, Text } from "@chakra-ui/react";
import { useBrowser } from "../../hooks/useBrowser";
import useAccountStore from "../../zustand/useAccountStore";

const NotAuthorized = () => {
  const { pushHome, pushSignIn } = useBrowser();
  const user = useAccountStore((state) => state.userInfo);
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
      <Kbd fontSize="140px">401</Kbd>
      <Text fontSize="18px" fontWeight="600" mt="7" textAlign="center">
        Bạn không có thẩm quyền để xem trang web này
      </Text>

      <Button
        mt="4"
        background="green.500"
        color="white"
        onClick={user ? pushHome : pushSignIn}
      >
        Quay về Trang chính
      </Button>
    </Box>
  );
};

export default NotAuthorized;
