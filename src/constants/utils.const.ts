import { ReactNode } from "react";

export const initPlace = {
  transform: "translateY(-600px)",
};

export interface MenuItem {
  label: string;
  onClick?: () => void;
  icon: ReactNode;
  isActive: boolean;
}

export enum WatchMode {
  KANBAN = "Kanban",
  TABLE = "Table",
}

export enum DropableType {
  BOARD = "Board",
  TASK_LIST = "Task List",
}

export interface RowData {
  label: string;
  key: string;
}

export interface ColData {
  row: RowData[];
  id: string;
}

export interface KanbanCol {
  label: string;
  id: string;
  colData: ColData;
  labelColor: string;
}

export interface KanbanData {
  parentID: string;
  colData: ColData;
}

export const MOCK_COL_LABEL: KanbanCol[] = [
  {
    label: "Cần làm",
    id: "To do",
    colData: {
      row: [
        {
          label: "label 1",
          key: crypto.randomUUID(),
        },
        {
          label: "label 2",
          key: crypto.randomUUID(),
        },
      ],
      id: crypto.randomUUID(),
    },
    labelColor: "green",
  },
  {
    label: "Đang Tiến Hành",
    id: "In progress",
    colData: {
      row: [
        {
          label: "label 3",
          key: crypto.randomUUID(),
        },
        {
          label: "label 4",
          key: crypto.randomUUID(),
        },
      ],
      id: crypto.randomUUID(),
    },
    labelColor: "purple",
  },
  {
    label: "Kết thúc",
    id: "Done",
    colData: {
      row: [
        {
          label: "label 5",
          key: crypto.randomUUID(),
        },
        {
          label: "label 6",
          key: crypto.randomUUID(),
        },
      ],
      id: crypto.randomUUID(),
    },
    labelColor: "red",
  },
];

export const MENU_ITEMS = [];
