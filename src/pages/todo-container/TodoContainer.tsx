import { Container, Box, ButtonGroup, Button, Tooltip } from "@chakra-ui/react";
import { MdTableChart } from "react-icons/md";
import { BsKanban } from "react-icons/bs";

import BasicContainer from "../../components/Container/BasicContainer";
import { WatchMode } from "../../constants/utils.const";
import { useMemo, useState } from "react";
import KanbanMode from "./KanbanMode/KanbanMode";
import TableMode from "./TableMode/TableMode";

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

  return (
    <Container maxW="container.xl" pt="6">
      <Box display="flex">
        <ButtonGroup spacing="3" ml="auto">
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
      </Box>
      <Box mt="3">{modeRender}</Box>
    </Container>
  );
};

export default TodoContainer;
