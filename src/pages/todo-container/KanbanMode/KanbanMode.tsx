import { Box, Button, SlideFade } from "@chakra-ui/react";
import { useCallback, FC, useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { AiOutlinePlus } from "react-icons/ai";

import { StrictModeDroppable } from "../../../components/Droppable/StrictModeDroppable";
import { MOCK_COL_LABEL, DropableType } from "../../../constants/utils.const";
import { getKanBanDragResult, swap } from "../../../helper/utils.helper";
import Column from "./components/Column";

const KanbanMode: FC = () => {
  const [isChangingKanban, setIsChangingKanban] = useState(false);
  const [kanban, setKanban] = useState(MOCK_COL_LABEL);

  const onDragEnd = useCallback(
    (dragResult: DropResult) => {
      const { source, destination, type } = dragResult;
      if (!destination) {
        return null;
      }

      if (type === DropableType.BOARD) {
        const newList = swap([...kanban], source.index, destination.index);
        return setKanban(newList);
      }
      const newKanban = getKanBanDragResult(kanban, source, destination);

      if (!newKanban?.length) {
        return null;
      }
      setIsChangingKanban(true);
      setKanban(newKanban);
    },
    [kanban]
  );

  const handleAddColumn = () => {
    setKanban((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        colData: {
          id: crypto.randomUUID(),
          row: [],
        },
        label: "New Column",
      },
    ]);
  };

  useEffect(
    () => () => {
      if (isChangingKanban) {
        // <-- Update Kanban only an only if user leave Kanban View Mode -->
        console.log("Kanban has changed");
        // <-- TODO: Compare old Kanban data and new Kanban data if they are the same not update -->
        setIsChangingKanban(false);
      }
    },
    [isChangingKanban]
  );

  return (
    <SlideFade in>
      <Box mt="5">
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable
            droppableId={DropableType.BOARD}
            type={DropableType.BOARD}
            direction="horizontal"
            isCombineEnabled
          >
            {({ droppableProps, innerRef, placeholder }) => (
              <Box display="flex" ref={innerRef} {...droppableProps}>
                {kanban?.map((col, index) => (
                  <Column key={col.id} index={index} kanbanColData={col} />
                ))}
                {placeholder}
                <Button onClick={handleAddColumn} background="blackAlpha.200">
                  <AiOutlinePlus />
                </Button>
              </Box>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </Box>
    </SlideFade>
  );
};

export default KanbanMode;
