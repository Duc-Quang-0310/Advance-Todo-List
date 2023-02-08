import { Box, ButtonGroup, Button, Tooltip, Icon } from "@chakra-ui/react";
import { MdTableChart } from "react-icons/md";
import { BsKanban, BsFillPlusSquareFill } from "react-icons/bs";

import { MOCK_COL_LABEL, WatchMode } from "../../constants/utils.const";
import { useCallback, useMemo, useState } from "react";
import KanbanMode from "./KanbanMode/KanbanMode";
import TableMode from "./TableMode/TableMode";
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import { CreateTaskOrTypeBody } from "../../constants/validate.const";

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
  const [data, setData] = useState<Partial<CreateTaskOrTypeBody>>();
  const [kanban, setKanban] = useState(MOCK_COL_LABEL);

  const handleClickAdd = useCallback(() => {
    setOpenModal(true);
    if (viewMode === WatchMode.KANBAN) {
      return setData({
        type: "tag",
      });
    }
    setData({
      type: "task",
    });
  }, [viewMode]);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setData({});
  }, []);

  const modeRender = useMemo(() => {
    switch (viewMode) {
      case WatchMode.KANBAN:
        return (
          <KanbanMode
            handleAddNewCol={handleClickAdd}
            kanban={kanban}
            setKanban={setKanban}
          />
        );
      case WatchMode.TABLE:
        return <TableMode />;
      default:
        return null;
    }
  }, [handleClickAdd, kanban, viewMode]);

  const handleChangeMode = useCallback((mode: WatchMode) => {
    setViewMode(mode);
  }, []);

  const handleSubmitCreation = useCallback((form: CreateTaskOrTypeBody) => {
    setKanban((prev) => [
      ...prev,
      {
        id: form?.id || crypto.randomUUID(),
        colData: {
          id: crypto.randomUUID(),
          row: [],
        },
        label: form.name || "New Column",
        labelColor: form?.colorTag || "pink",
      },
    ]);
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
        onSubmit={handleSubmitCreation}
        data={data}
      />
    </Box>
  );
};

export default TodoContainer;
