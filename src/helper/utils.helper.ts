import { Timestamp } from "firebase/firestore";
import { DraggableLocation } from "react-beautiful-dnd";
import { TagColor } from "../constants/color.const";
import { KanbanCol, RowData } from "../constants/utils.const";
import { Stage } from "../zustand/type";

export type KanbanDataType = {
  colData: {
    label: string;
    key: string;
  }[];
  key: string;
}[];

export function swap<T>(
  currentArray: Array<T>,
  fromIndex: number,
  toIndex: number
): Array<T> {
  const resultArray = [...currentArray];
  const firstItem = resultArray[fromIndex];
  const swappedItem = resultArray[toIndex];
  currentArray[fromIndex] = swappedItem;
  currentArray[toIndex] = firstItem;
  return currentArray;
}

export function getKanBanDragResult(
  kanban: KanbanCol[],
  source: DraggableLocation,
  destination: DraggableLocation | null | undefined
): KanbanCol[] {
  if (!destination) {
    return [];
  }

  const oldKanban = [...kanban];

  const sourceCol = oldKanban.find(
    (kanban) => kanban?.colData?.id === source?.droppableId
  );
  const destinationCol = oldKanban.find(
    (kanban) => kanban?.colData?.id === destination?.droppableId
  );
  const destinationColIndex = oldKanban.findIndex(
    (kanban) => kanban?.colData?.id === destination?.droppableId
  );

  if (!sourceCol || !destinationCol || destinationColIndex === -1) {
    return [];
  }

  const removedTask = sourceCol?.colData?.row?.[source.index];
  const newKanban: KanbanCol[] = oldKanban?.map((kanban) => {
    const row = kanban?.colData?.row?.filter(
      (row) => row?.key !== removedTask?.key
    );
    return {
      id: kanban?.id,
      label: kanban?.label,
      colData: {
        id: kanban?.colData?.id,
        row,
      },
      labelColor: kanban?.labelColor,
    };
  });

  const isSwapTaskInOneCol = [...destinationCol?.colData?.row]?.some(
    (row) => row.key === removedTask?.key
  );

  const destinationRowData = [...destinationCol?.colData?.row];

  if (isSwapTaskInOneCol) {
    let swappedData: RowData[] = [];

    if (
      source.index === 0 &&
      destination.index === destinationRowData.length - 1
    ) {
      destinationRowData.shift();
      swappedData = [...destinationRowData, removedTask];
    } else if (
      source.index === destinationRowData.length - 1 &&
      destination.index === 0
    ) {
      destinationRowData.pop();
      swappedData = [removedTask, ...destinationRowData];
    } else {
      swappedData = swap(destinationRowData, source.index, destination.index);
    }

    newKanban[destinationColIndex] = {
      id: newKanban[destinationColIndex]?.id,
      label: newKanban[destinationColIndex]?.label,
      colData: {
        id: newKanban[destinationColIndex]?.colData?.id,
        row: swappedData,
      },
      labelColor: newKanban[destinationColIndex]?.labelColor,
    };
  } else {
    const startCol = destinationRowData.slice(0, destination?.index);
    const endCol = destinationRowData.slice(destination?.index);
    const newColumnData = [...startCol, removedTask, ...endCol];

    newKanban[destinationColIndex] = {
      id: newKanban[destinationColIndex]?.id,
      label: newKanban[destinationColIndex]?.label,
      colData: {
        id: newKanban[destinationColIndex]?.colData?.id,
        row: newColumnData,
      },
      labelColor: newKanban[destinationColIndex]?.labelColor,
    };
  }

  return newKanban;
}

export const getDefaultStageData = (usrId: string): Stage[] => [
  {
    colorChema: TagColor.blue,
    description: "M???c ?????nh",
    label: "C???n l??m",
    order: 0,
    refID: crypto.randomUUID(),
    createdAt: Timestamp.now(),
    userId: usrId,
    isDefault: true,
  },
  {
    colorChema: TagColor.purple,
    description: "M???c ?????nh",
    label: "??ang ti???n h??nh",
    order: 1,
    refID: crypto.randomUUID(),
    createdAt: Timestamp.now(),
    userId: usrId,
    isDefault: true,
  },
  {
    colorChema: TagColor.green,
    description: "M???c ?????nh",
    label: "Ho??n th??nh",
    order: 2,
    refID: crypto.randomUUID(),
    createdAt: Timestamp.now(),
    userId: usrId,
    isDefault: true,
  },
];
