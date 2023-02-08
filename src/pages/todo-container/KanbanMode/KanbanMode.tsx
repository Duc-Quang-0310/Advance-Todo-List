import { Box, Button, SlideFade } from "@chakra-ui/react";
import {
  useCallback,
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { AiOutlinePlus } from "react-icons/ai";

import { StrictModeDroppable } from "../../../components/Droppable/StrictModeDroppable";
import { DropableType, KanbanCol } from "../../../constants/utils.const";
import { getKanBanDragResult, swap } from "../../../helper/utils.helper";
import Column from "./components/Column";

interface KanbanModeProps {
  handleAddNewCol: () => void;
  kanban: KanbanCol[];
  setKanban: Dispatch<SetStateAction<KanbanCol[]>>;
}

const KanbanMode: FC<KanbanModeProps> = ({
  handleAddNewCol,
  kanban,
  setKanban,
}) => {
  const [isChangingKanban, setIsChangingKanban] = useState(false);

  const onDragEnd = useCallback(
    (dragResult: DropResult) => {
      const { source, destination, type } = dragResult;
      if (!destination) {
        return null;
      }

      if (type === DropableType.BOARD) {
        let oldKanban: KanbanCol[] = [];

        if (source.index === 0 && destination.index === kanban?.length - 1) {
          const defaultKanban = [...kanban];
          defaultKanban.shift();
          oldKanban = [...defaultKanban, kanban[0]];
        } else if (
          source.index === kanban?.length - 1 &&
          destination.index === 0
        ) {
          const defaultKanban = [...kanban];
          defaultKanban.pop();
          oldKanban = [kanban[kanban?.length - 1], ...defaultKanban];
        } else {
          oldKanban = swap([...kanban], source.index, destination.index);
        }

        return setKanban(oldKanban);
      }
      const newKanban = getKanBanDragResult(kanban, source, destination);

      if (!newKanban?.length) {
        return null;
      }
      setIsChangingKanban(true);
      setKanban(newKanban);
    },
    [kanban, setKanban]
  );

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
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable
          droppableId={DropableType.BOARD}
          type={DropableType.BOARD}
          key={DropableType.BOARD}
          direction="horizontal"
          isCombineEnabled
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
