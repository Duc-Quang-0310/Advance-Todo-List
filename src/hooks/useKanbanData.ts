import { startTransition, useEffect, useState } from "react";
import { KanbanCol, RowData } from "../constants/utils.const";
import useAccountStore from "../zustand/useAccountStore";
import useStageStore from "../zustand/useStageStore";
import useTaskStore from "../zustand/useTaskStore";

const useKanbanData = () => {
  const allStage = useStageStore((state) => state.allStage);
  const getAllStage = useStageStore((state) => state.getAllStage);
  const userInfo = useAccountStore((state) => state.userInfo);
  const getAllTask = useTaskStore((state) => state.getAllTask);
  const tasks = useTaskStore((state) => state.tasks);
  const [kanban, setKanban] = useState<KanbanCol[]>([]);

  useEffect(() => {
    if (allStage.length > 0) {
      const listKanbanData: KanbanCol[] = allStage.map((stage) => {
        const row: RowData[] =
          tasks.length === 0
            ? []
            : tasks
                .filter((task) => task.stageId === stage.id)
                .map((task) => ({
                  key: task?.id || crypto.randomUUID(),
                  id: task?.id || crypto.randomUUID(),
                  label: task.name,
                }));

        return {
          colData: {
            row,
            id: crypto.randomUUID(),
          },
          id: stage.id || crypto.randomUUID(),
          label: stage.label,
          labelColor: stage.colorChema,
          order: stage.order,
        };
      });

      setKanban(listKanbanData);
    }
  }, [allStage, tasks]);

  useEffect(() => {
    if (userInfo) {
      getAllStage({
        user: {
          uid: userInfo?.userID,
        },
      });
      getAllTask({
        user: {
          uid: userInfo?.userID,
        },
      });
    }
  }, [getAllStage, getAllTask, userInfo]);

  return { kanban, setKanban };
};

export default useKanbanData;
