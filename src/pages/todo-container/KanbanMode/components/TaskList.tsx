import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../../../../components/Droppable/StrictModeDroppable";
import { DropableType, KanbanData } from "../../../../constants/utils.const";
import Task from "./Task";

interface TaskListProps {
  tasks: KanbanData | undefined;
}

function TaskList({ tasks }: TaskListProps) {
  const currentTasks = useMemo(() => {
    if (tasks?.colData?.row) {
      return [...tasks?.colData?.row];
    }

    return [];
  }, [tasks?.colData?.row]);

  if (!tasks) {
    return null;
  }

  return (
    <StrictModeDroppable
      droppableId={tasks?.colData?.id}
      type={DropableType.TASK_LIST}
    >
      {({ droppableProps, innerRef, placeholder }, { isDraggingOver }) => (
        <Box
          ref={innerRef}
          background={isDraggingOver ? "blue.100" : ""}
          {...droppableProps}
        >
          {currentTasks?.length > 0 &&
            currentTasks?.map((task, index) => (
              <Draggable key={task?.key} draggableId={task?.key} index={index}>
                {(dragProvided, { isDragging }) => (
                  <Task
                    isDragging={isDragging}
                    task={task}
                    provided={dragProvided}
                  />
                )}
              </Draggable>
            ))}
          {placeholder}
        </Box>
      )}
    </StrictModeDroppable>
  );
}

export default TaskList;
