import { Box, ButtonGroup, Button, Tooltip, Icon } from "@chakra-ui/react";
import { MdTableChart } from "react-icons/md";
import { BsKanban, BsFillPlusSquareFill } from "react-icons/bs";

import { WatchMode } from "../../constants/utils.const";
import { useCallback, useMemo, useState } from "react";
import KanbanMode from "./KanbanMode/KanbanMode";
import TableMode from "./TableMode/TableMode";
import AddTaskModal from "./AddTaskModal/AddTaskModal";

const ButtonMode = [
  {
    mode: WatchMode.KANBAN,
    icon: <BsKanban size={20} />,
    message: "Hiển thị dạng khối",
  },
  {
    mode: WatchMode.TABLE,
    icon: <MdTableChart size={20} />,
    message: "Hiển thị dạng bảng",
  },
];

const TodoContainer = () => {
  const [viewMode, setViewMode] = useState(WatchMode.KANBAN);
  const [openModal, setOpenModal] = useState(false);

  const modeRender = useMemo(() => {
    switch (viewMode) {
      case WatchMode.KANBAN:
        return <KanbanMode />;
      case WatchMode.TABLE:
        return <TableMode />;
      default:
        return null;
    }
  }, [viewMode]);

  function handleChangeMode(mode: WatchMode) {
    setViewMode(mode);
  }

  const handleClickAdd = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  return (
    <Box pt="4" px="3" height="100%" w="100%">
      <Box display="flex">
        <ButtonGroup spacing="3">
          {ButtonMode.map(({ icon, mode, message }) => (
            <Tooltip
              key={mode}
              label={message}
              bg="blackAlpha.700"
              px="3"
              py="1"
            >
              <Button
                colorScheme="teal"
                variant={viewMode === mode ? "solid" : "ghost"}
                paddingInline={4}
                onClick={() => handleChangeMode(mode)}
              >
                {icon}
              </Button>
            </Tooltip>
          ))}
        </ButtonGroup>

        <Button
          rightIcon={<Icon as={BsFillPlusSquareFill} />}
          colorScheme="teal"
          variant="solid"
          ml="auto"
          onClick={handleClickAdd}
        >
          Thêm mới
        </Button>
      </Box>
      <Box mt="5">{modeRender}</Box>
      <AddTaskModal
        isOpen={openModal}
        key={crypto.randomUUID()}
        handleClose={handleCloseModal}
      />
    </Box>
  );
};

export default TodoContainer;
