import { Badge, Box } from "@chakra-ui/react";
import { FC } from "react";
import { Draggable } from "react-beautiful-dnd";

import { KanbanCol } from "../../../../constants/utils.const";
import TaskList from "./TaskList";

interface ColumnProps {
  index: number;
  kanbanColData: KanbanCol;
}

const Column: FC<ColumnProps> = ({ index, kanbanColData }) => (
  <Draggable
    draggableId={kanbanColData?.label + kanbanColData?.id}
    index={index}
  >
    {({ dragHandleProps, draggableProps, innerRef }, { isDragging }) => (
      <Box
        ref={innerRef}
        mr="4"
        px="5"
        py="2"
        background={isDragging ? "green.300" : "blackAlpha.200"}
        width="250px"
        userSelect="none"
        {...draggableProps}
      >
        <Box mb={3} {...dragHandleProps}>
          <Badge colorScheme={kanbanColData?.labelColor}>
            {kanbanColData?.label}
          </Badge>
        </Box>
        <TaskList
          tasks={{
            colData: kanbanColData?.colData,
            parentID: kanbanColData?.id,
          }}
        />
      </Box>
    )}
  </Draggable>
);

export default Column;
