import { Box, Button, SlideFade } from "@chakra-ui/react";
import { useCallback, FC, Dispatch, SetStateAction } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { AiOutlinePlus } from "react-icons/ai";

import { StrictModeDroppable } from "../../../components/Droppable/StrictModeDroppable";
import { DropableType, KanbanCol } from "../../../constants/utils.const";
import useStageStore from "../../../zustand/useStageStore";
import useTaskStore from "../../../zustand/useTaskStore";
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
  const updateTask = useTaskStore((state) => state.updateTask);
  const updateStage = useStageStore((state) => state.updateStage);

  const onDragEnd = useCallback(
    async (dragResult: DropResult) => {
      const { source, destination, type } = dragResult;

      if (!destination) {
        return null;
      }

      if (
        destination.index === source.index &&
        destination.droppableId === source.droppableId
      ) {
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

      const movedTo = structuredClone<KanbanCol[]>(kanban).find(
        (k) => k.colData.id === destination.droppableId
      );

      const movedFrom = structuredClone<KanbanCol[]>(kanban).find(
        (k) => k.colData.id === source.droppableId
      );

      if (movedTo && movedFrom) {
        await updateTask({
          id: movedFrom?.colData?.row?.[source.index]?.id,
          stageId: movedTo?.id,
        });
      }
    },
    [allStage, kanban, setKanban, updateStage, updateTask]
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
