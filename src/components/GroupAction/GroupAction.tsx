import { Button, ButtonGroup, ChakraComponent, Icon } from "@chakra-ui/react";
import { FC, ReactNode, useCallback, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

interface Props {
  disable?: {
    edit?: boolean;
    view?: boolean;
    delete?: boolean;
  };
  action?: {
    edit?: () => void;
    view?: () => void;
    delete?: () => void;
  };
  icon?: {
    edit?: IconType;
    view?: IconType;
    delete?: IconType;
  };
  children?: ReactNode;
}

type ActionGroupComponent = ChakraComponent<"div", Props>;

const GroupAction: FC<Props> = ({
  action,
  disable,
  icon,
  children,
  ...other
}) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleCloseModal = () => setOpenConfirmModal(false);

  const handleAction = useCallback(
    async (onAction: "delete" | "view" | "edit") => {
      switch (onAction) {
        case "delete":
          return setOpenConfirmModal(true);
        case "view":
          return action?.view?.();
        case "edit":
          return action?.edit?.();
        default:
          return null;
      }
    },
    [action]
  );

  const handleConfirmDelete = useCallback(() => {
    action?.delete?.();
    setOpenConfirmModal(false);
  }, [action]);

  return (
    <ButtonGroup size="xs" {...other}>
      <Button colorScheme="blue" onClick={() => handleAction("view")}>
        <Icon as={icon?.view || FiEye} w={4} h={4} />
      </Button>
      <Button
        colorScheme="green"
        disabled={disable?.edit}
        onClick={() => handleAction("edit")}
      >
        <Icon as={icon?.edit || FiEdit2} w={3.5} h={3.5} />
      </Button>
      <Button
        colorScheme="red"
        disabled={disable?.delete}
        onClick={() => handleAction("delete")}
      >
        <Icon as={icon?.delete || MdDeleteOutline} w={4} h={4} />
      </Button>
      <ConfirmModal
        openModal={openConfirmModal}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmDelete}
        text={{
          title: "Xác nhận xóa giai đoạn",
        }}
      />
      {children}
    </ButtonGroup>
  );
};

export default GroupAction as ActionGroupComponent;
