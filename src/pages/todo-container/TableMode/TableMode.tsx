import {
  Badge,
  SlideFade,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { TABLE_MOCK_DATA } from "../../../constants/utils.const";

const tableHeaders = [
  "ID",
  "Tên",
  "Giai đoạn",
  "Thẻ",
  "Ngày bắt đầu",
  "Ngày kết thúc",
  "Mô tả",
];

const TableMode = () => {
  return (
    <SlideFade in>
      <TableContainer>
        <Table variant="striped">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
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
            {TABLE_MOCK_DATA.map((tableData) => (
              <Tr key={tableData?.id}>
                <Td>{tableData?.id}</Td>
                <Td>{tableData?.name}</Td>
                <Td>
                  <Badge colorScheme={tableData?.stage.color} userSelect="none">
                    {tableData?.stage.label}
                  </Badge>
                </Td>
                <Td display="flex">
                  {tableData?.tags?.map((tag) => (
                    <Badge
                      colorScheme={tag?.color}
                      key={tag?.label}
                      mr="2"
                      userSelect="none"
                    >
                      {tag?.label}
                    </Badge>
                  ))}
                </Td>
                <Td>
                  {tableData?.startDate || format(new Date(), "dd-MM-yyyy")}
                </Td>
                <Td>
                  {tableData?.endDate || format(new Date(), "dd-MM-yyyy")}
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
