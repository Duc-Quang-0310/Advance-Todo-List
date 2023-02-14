import { Box, ButtonGroup, Button, Tooltip, Icon } from "@chakra-ui/react";
import { MdTableChart } from "react-icons/md";
import { BsKanban, BsFillPlusSquareFill } from "react-icons/bs";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";

import {
  FilteredFields,
  filterFields,
  MOCK_COL_LABEL,
  WatchMode,
} from "../../constants/utils.const";
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import { CreateTaskOrTypeBody } from "../../constants/validate.const";
import TodoFilter from "./TodoFilter/TodoFilter";
import LoadingFallBack from "../../components/LoadingFallBack/LoadingFallBack";

const KanbanMode = lazy(() => import("./KanbanMode/KanbanMode"));
const TableMode = lazy(() => import("./TableMode/TableMode"));

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
  const [filter, setFilter] = useState(filterFields);

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

  const filteredKanban = useMemo(() => {
    let oldKanban = [...kanban] || [];

    const { stage } = filter;

    if (stage) {
      oldKanban = oldKanban.filter((each) => each.id === stage);
    }

    return oldKanban;
  }, [filter, kanban]);

  const modeRender = useMemo(() => {
    switch (viewMode) {
      case WatchMode.KANBAN:
        return (
          <KanbanMode
            handleAddNewCol={handleClickAdd}
            kanban={filteredKanban}
            setKanban={setKanban}
          />
        );
      case WatchMode.TABLE:
        return <TableMode />;
      default:
        return null;
    }
  }, [handleClickAdd, filteredKanban, viewMode]);

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

  const handleUpdateFilter = useCallback((filter: FilteredFields) => {
    setFilter(filter);
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

        <ButtonGroup ml="auto" spacing="3">
          <Button
            rightIcon={<Icon as={BsFillPlusSquareFill} />}
            colorScheme="teal"
            variant="solid"
            onClick={handleClickAdd}
            boxShadow="md"
          >
            Thêm mới
          </Button>
          <TodoFilter handleUpdateFilter={handleUpdateFilter} filter={filter} />
        </ButtonGroup>
      </Box>
      <Box mt="5">
        <Suspense fallback={<LoadingFallBack height="500px" />}>
          {modeRender}
        </Suspense>
      </Box>
      <AddTaskModal
        isOpen={openModal}
        handleClose={handleCloseModal}
        onSubmit={handleSubmitCreation}
        data={data}
      />
    </Box>
  );
};

export default TodoContainer;
