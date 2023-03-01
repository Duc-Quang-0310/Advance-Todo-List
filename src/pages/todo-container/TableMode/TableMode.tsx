import {
  Badge,
  SlideFade,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { FC, useCallback, useMemo } from "react";
import GroupAction from "../../../components/GroupAction/GroupAction";
import { TableData } from "../../../constants/utils.const";
import { CreateTaskOrTypeBody } from "../../../constants/validate.const";
import { Stage } from "../../../zustand/type";
import useStageStore from "../../../zustand/useStageStore";
import useTaskStore from "../../../zustand/useTaskStore";

const tableHeaders = [
  "Hành động",
  "Tên",
  "Giai đoạn",
  "Thẻ",
  "Ngày bắt đầu",
  "Ngày kết thúc",
  "Mô tả",
];

interface Props {
  onModeClick: (
    action: "view" | "edit",
    data: Partial<CreateTaskOrTypeBody>
  ) => void;
}

const TableMode: FC<Props> = ({ onModeClick }) => {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const allStage = useStageStore((state) => state.allStage);

  const tableData: TableData[] = useMemo(
    () =>
      tasks.length > 0
        ? tasks.map((t) => ({
            id: t?.id || crypto.randomUUID(),
            name: t?.name || "",
            stage: allStage.find((st) => st.id === t.stageId) as Stage,
            tags: [],
            startDate: t.startDate?.toDate() || new Date(),
            endDate: t.endDate?.toDate() || new Date(),
            description: t?.description || "",
          }))
        : [],
    [allStage, tasks]
  );

  const handleDeleteTask = useCallback(
    (data: TableData) => deleteTask({ id: data?.id }),
    [deleteTask]
  );

  return (
    <SlideFade in>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr backgroundColor="green.300">
              {tableHeaders?.map((header) => (
                <Th key={header} color="whiteAlpha.900">
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((tableData) => (
              <Tr key={tableData?.id}>
                <Td display="flex">
                  <GroupAction
                    action={{
                      delete: () => handleDeleteTask(tableData),
                      view: () => {
                        onModeClick("view", {
                          type: "task",
                          description: tableData?.description,
                          startDate: format(tableData?.startDate, "yyyy-MM-dd"),
                          endDate: format(tableData?.endDate, "yyyy-MM-dd"),
                          id: tableData?.id,
                          name: tableData?.name,
                        });
                      },
                      edit: () => {
                        onModeClick("edit", {
                          type: "task",
                          description: tableData?.description,
                          startDate: format(tableData?.startDate, "yyyy-MM-dd"),
                          endDate: format(tableData?.endDate, "yyyy-MM-dd"),
                          id: tableData?.id,
                          name: tableData?.name,
                        });
                      },
                    }}
                  />
                </Td>
                <Td>{tableData?.name}</Td>
                <Td>
                  <Badge
                    colorScheme={tableData?.stage.colorChema}
                    userSelect="none"
                  >
                    {tableData?.stage.label}
                  </Badge>
                </Td>
                <Td
                  display={
                    tableData?.tags?.length > 0 ? "flex" : "-moz-initial"
                  }
                >
                  {tableData?.tags?.length > 0
                    ? tableData?.tags?.map((tag) => (
                        <Badge
                          colorScheme={tag?.color}
                          key={tag?.label}
                          mr="2"
                          userSelect="none"
                        >
                          {tag?.label}
                        </Badge>
                      ))
                    : ""}
                </Td>
                <Td>
                  {tableData?.startDate
                    ? format(tableData?.startDate, "dd-MM-yyyy")
                    : ""}
                </Td>
                <Td>
                  {tableData?.endDate
                    ? format(new Date(tableData?.endDate), "dd-MM-yyyy")
                    : ""}
                </Td>
                <Td>{tableData?.description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </SlideFade>
  );
};

export default TableMode;
