import { Box, Text } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { Draggable } from "react-beautiful-dnd";

import { KanbanCol } from "../../../../constants/utils.const";
import TaskList from "./TaskList";

interface ColumnProps {
  index: number;
  kanbanColData: KanbanCol;
}

const Column: FC<ColumnProps> = ({ index, kanbanColData }) => {
  const columnMemo = useMemo(() => ({ ...kanbanColData }), [kanbanColData]);

  return (
    <Draggable draggableId={columnMemo?.label} index={index}>
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
          <Text
            fontSize="xl"
            mb={3}
            fontWeight="600"
            textTransform="uppercase"
            {...dragHandleProps}
            color="blackAlpha.600"
          >
            {columnMemo?.label}
          </Text>
          <TaskList
            tasks={{
              colData: columnMemo?.colData,
              parentID: columnMemo?.id,
            }}
          />
        </Box>
      )}
    </Draggable>
  );
};

export default Column;
