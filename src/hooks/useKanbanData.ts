import { useEffect, useState } from "react";
import { KanbanCol } from "../constants/utils.const";
import useAccountStore from "../zustand/useAccountStore";
import useStageStore from "../zustand/useStageStore";

const useKanbanData = () => {
  const allStage = useStageStore((state) => state.allStage);
  const getAllStage = useStageStore((state) => state.getAllStage);
  const userInfo = useAccountStore((state) => state.userInfo);
  const [kanban, setKanban] = useState<KanbanCol[]>([]);

  useEffect(() => {
    if (allStage.length > 0) {
      const listKanbanData: KanbanCol[] = allStage.map((stage) => ({
        colData: {
          row: [],
          id: crypto.randomUUID(),
        },
        id: stage.id || crypto.randomUUID(),
        label: stage.label,
        labelColor: stage.colorChema,
        order: stage.order,
      }));

      setKanban(listKanbanData);
    }
  }, [allStage]);

  useEffect(() => {
    if (userInfo) {
      getAllStage({
        user: {
          uid: userInfo?.userID,
        },
      });
    }
  }, [getAllStage, userInfo]);

  return { kanban, setKanban };
};

export default useKanbanData;
