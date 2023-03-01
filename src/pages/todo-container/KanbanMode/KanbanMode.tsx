import { Box, Button, SlideFade } from "@chakra-ui/react";
import { useCallback, FC, Dispatch, SetStateAction } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { AiOutlinePlus } from "react-icons/ai";

import { StrictModeDroppable } from "../../../components/Droppable/StrictModeDroppable";
import { DropableType, KanbanCol } from "../../../constants/utils.const";
import { getKanBanDragResult } from "../../../helper/utils.helper";
import useStageStore from "../../../zustand/useStageStore";
import Column from "./components/Column";

interface KanbanModeProps {
  handleAddNewCol: () => void;
  kanban: KanbanCol[];
  setKanban: Dispatch<SetStateAction<KanbanCol[]>>;
  defaultKanban: KanbanCol[];
}

const KanbanMode: FC<KanbanModeProps> = ({
  handleAddNewCol,
  kanban,
  setKanban,
  defaultKanban,
}) => {
  const allStage = useStageStore((state) => state.allStage);
  const updateStage = useStageStore((state) => state.updateStage);

  const onDragEnd = useCallback(
    (dragResult: DropResult) => {
      const { source, destination, type } = dragResult;
      if (!destination) {
        return null;
      }

      if (destination.index === source.index) {
        return;
      }

      if (type === DropableType.BOARD) {
        const updatedKanban: KanbanCol[] = Array.from(kanban);
        const [removedEl] = updatedKanban.splice(source.index, 1);
        updatedKanban.splice(destination.index, 0, removedEl);

        const changedCols = allStage
          ?.map((stage, index) => {
            if (stage.id !== updatedKanban?.[index]?.id) {
              const newIndexOrder: number = updatedKanban?.findIndex(
                (kb) => kb.id === stage.id
              );

              if (newIndexOrder !== -1) {
                return { ...stage, order: newIndexOrder };
              }

              return null;
            }
            return null;
          })
          ?.filter((i) => i !== null);

        if (changedCols.length) {
          Promise.allSettled(
            changedCols.map((col) =>
              updateStage(
                {
                  id: col?.id,
                  order: col?.order,
                },
                () => {},
                true
              )
            )
          );
        }

        return setKanban(updatedKanban);
      }
      const newKanban = getKanBanDragResult(kanban, source, destination);

      if (!newKanban?.length) {
        return null;
      }
      setKanban(newKanban);
    },
    [allStage, kanban, setKanban, updateStage]
  );

  return (
    <SlideFade in>
      <DragDropContext onDragEnd={onDragEnd} dragHandleUsageInstructions="Yes">
        <StrictModeDroppable
          droppableId={DropableType.BOARD}
          type={DropableType.BOARD}
          key={DropableType.BOARD}
          direction="horizontal"
          isCombineEnabled
          isDropDisabled={kanban.length !== defaultKanban.length}
        >
          {({ droppableProps, innerRef, placeholder }) => (
            <Box display="flex" ref={innerRef} {...droppableProps}>
              {kanban?.map((col, index) => (
                <Column key={col.id} index={index} kanbanColData={col} />
              ))}
              {placeholder}
              <Button onClick={handleAddNewCol} background="blackAlpha.200">
                <AiOutlinePlus />
              </Button>
            </Box>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </SlideFade>
  );
};

export default KanbanMode;
