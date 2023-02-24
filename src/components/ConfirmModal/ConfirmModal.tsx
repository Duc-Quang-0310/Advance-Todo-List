import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  Text,
  ModalCloseButton,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { FC, ReactNode, useMemo } from "react";

interface Props {
  onCancel?: () => void;
  onConfirm?: () => void;
  text?: {
    txtCancel?: string;
    txtConfirm?: string;
    content?: ReactNode;
    title?: ReactNode;
  };
  customElements?: {
    header?: ReactNode;
    body?: ReactNode;
    footer?: ReactNode;
  };
  openModal: boolean;
}

const ConfirmModal: FC<Props> = ({
  openModal,
  onCancel,
  onConfirm,
  text = {},
  customElements = {},
}) => {
  const { txtCancel, txtConfirm, content, title } = text;
  const { body, footer, header } = customElements;

  const renderBody = useMemo(
    () =>
      body ? (
        body
      ) : (
        <Text fontSize="15px" color="blackAlpha.700">
          {content
            ? content
            : "Hành động bạn chuẩn bị làm sẽ không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?"}
        </Text>
      ),
    [body, content]
  );

  const renderHeader = useMemo(
    () =>
      header ? (
        header
      ) : (
        <>
          <Text fontSize="17px">{title ? title : "Xác nhận hành động"}</Text>
          <ModalCloseButton />
        </>
      ),
    [header, title]
  );

  const renderFooter = useMemo(
    () =>
      footer ? (
        footer
      ) : (
        <ButtonGroup>
          <Button colorScheme="red" onClick={() => onConfirm?.()}>
            {txtConfirm ? txtConfirm : "Xác nhận"}
          </Button>
          <Button
            variant="ghost"
            color="blackAlpha.600"
            onClick={() => onCancel?.()}
          >
            {txtCancel ? txtCancel : "Hủy"}
          </Button>
        </ButtonGroup>
      ),
    [footer, onCancel, onConfirm, txtCancel, txtConfirm]
  );

  return (
    <Modal
      isOpen={openModal}
      closeOnOverlayClick
      closeOnEsc
      size="lg"
      onClose={() => onCancel?.()}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          backgroundColor="red.400"
          color="white"
          borderTopRadius="6px"
          display="flex"
          alignItems="center"
          py="2"
        >
          {renderHeader}
        </ModalHeader>
        <ModalBody pt="5">{renderBody}</ModalBody>
        <ModalFooter pt="5">{renderFooter}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
