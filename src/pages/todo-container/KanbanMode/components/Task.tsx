import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { RowData } from "../../../../constants/utils.const";

interface Props {
  task: RowData;
  isDragging: boolean;
  provided: DraggableProvided;
}

const Task: FC<Props> = ({ task, isDragging, provided }) => {
  const { dragHandleProps, draggableProps, innerRef } = provided;

  return (
    <Box
      p="3"
      mb="2"
      display="flex"
      flexDirection="column"
      ref={innerRef}
      boxShadow="md"
      backgroundColor={isDragging ? "green.200" : "whiteAlpha.800"}
      cursor={isDragging ? "grabbing" : "grab"}
      {...dragHandleProps}
      {...draggableProps}
    >
      <Text>{task?.label}</Text>
    </Box>
  );
};

export default Task;
