import { AddIcon } from "@chakra-ui/icons";
import {
  SlideFade,
  Box,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Text,
  Button,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { CreateTaskOrTypeBody } from "../../../../constants/validate.const";
import useAccountStore from "../../../../zustand/useAccountStore";

import useStageStore from "../../../../zustand/useStageStore";
import AddTaskModal from "../../../todo-container/AddTaskModal/AddTaskModal";
import { toastError } from "../../../../helper/toast";
import { Stage } from "../../../../zustand/type";
import LoadingFallBack from "../../../../components/LoadingFallBack/LoadingFallBack";
import GroupAction from "../../../../components/GroupAction/GroupAction";

const tableHeaders = [
  "Hành động",
  "Tên giai đoạn",
  "Mô tả",
  "Tạo bởi",
  "Tạo vào",
  "Cập nhật vào",
  "",
];

const ChangeStage: FC = () => {
  const getAllStage = useStageStore((state) => state.getAllStage);
  const createNewStage = useStageStore((state) => state.createNewStage);
  const updateStage = useStageStore((state) => state.updateStage);
  const deleteStage = useStageStore((state) => state.deleteStage);
  const loading = useStageStore((state) => state.loading);
  const allStage = useStageStore((state) => state.allStage);
  const userInfo = useAccountStore((state) => state.userInfo);

  const [onView, setOnView] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<
    Partial<CreateTaskOrTypeBody>
  >({ type: "tag" });

  const handleClearData = useCallback(() => {
    setOnView(false);
    setOpenModal(false);
    setSelectedStage({ type: "tag" });
  }, []);

  const handleCloseModal = useCallback(() => {
    handleClearData();
  }, [handleClearData]);

  const handleSubmitOnModal = useCallback(
    (data: CreateTaskOrTypeBody) => {
      const { id, name, description = "", colorTag = "" } = data;

      if (id) {
        updateStage(
          { id, colorChema: colorTag, description, label: name },
          handleClearData
        );
      } else {
        if (allStage?.length > 10) {
          return toastError({ title: "Chỉ được tạo tối đa 10 giai đoạn" });
        }

        const listOldStage = allStage?.map((stage) => stage.label);
        if (listOldStage.some((old) => old.trim() === name.trim())) {
          return toastError({
            title: "Giai đoạn này đã có vui lòng chọn tên khác",
          });
        }

        createNewStage(
          {
            colorChema: colorTag,
            description,
            label: name,
            userId: userInfo?.userID as string,
            order: allStage?.length + 1,
            refID: crypto.randomUUID(),
          },
          handleClearData
        );
      }
    },
    [updateStage, handleClearData, allStage, createNewStage, userInfo?.userID]
  );

  const handleAction = useCallback(
    async (data?: Stage, onAction?: "delete" | "view" | "edit") => {
      if (!onAction) {
        return;
      }

      if (!data) {
        return toastError({
          title: "Bạn cần chọn giai đoạn trước",
        });
      }

      if (onAction === "delete" && data?.id) {
        return deleteStage({ id: data?.id });
      }

      setOpenModal(true);

      setSelectedStage({
        colorTag: data?.colorChema,
        description: data?.description,
        name: data?.label,
        id: data?.id,
        type: "tag",
      });

      if (onAction === "view") {
        return setOnView(true);
      }

      setOnView(false);
    },
    [deleteStage]
  );

  const renderTableCaption = useMemo(() => {
    if (loading) {
      return (
        <LoadingFallBack height="calc(100vh - 300px)">
          <Text>Đang lấy dữ liệu</Text>
        </LoadingFallBack>
      );
    }

    return allStage?.length === 0 ? (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Text fontSize="xl" mb="4">
          Chưa có dữ liệu vui lòng tạo mới
        </Text>
        <Button
          colorScheme="green"
          variant="solid"
          onClick={() => setOpenModal((prev) => !prev)}
          disabled={loading || allStage?.length >= 10}
        >
          Tạo mới
        </Button>
      </Box>
    ) : null;
  }, [allStage?.length, loading]);

  useEffect(() => {
    getAllStage({
      user: {
        uid: userInfo?.userID,
      },
    });
  }, [getAllStage, userInfo?.userID]);

  return (
    <SlideFade in>
      <Box display="flex" px="20" mt="10">
        <TableContainer w="100%">
          <Table variant="striped">
            <TableCaption px="0">{renderTableCaption}</TableCaption>
            <Thead>
              <Tr backgroundColor="green.300">
                {tableHeaders?.map((header, index) => (
                  <Th key={header} color="whiteAlpha.900">
                    {index !== tableHeaders.length - 1 ? (
                      header
                    ) : (
                      <Box w="100%" display="flex" justifyContent="center">
                        <Button
                          colorScheme="whatsapp"
                          variant="solid"
                          onClick={() => setOpenModal((prev) => !prev)}
                          disabled={loading}
                          px="4"
                          size="xs"
                        >
                          <AddIcon />
                        </Button>
                      </Box>
                    )}
                  </Th>
                ))}
              </Tr>
            </Thead>
            {allStage?.length > 0 && !loading && (
              <Tbody>
                {allStage.map((stage) => (
                  <Tr key={stage.refID + stage.label}>
                    <Td display="flex">
                      <GroupAction
                        disable={{
                          edit: stage?.isDefault,
                          delete: stage?.isDefault,
                        }}
                        action={{
                          delete: () => handleAction(stage, "delete"),
                          view: () => handleAction(stage, "view"),
                          edit: () => handleAction(stage, "edit"),
                        }}
                      />
                    </Td>
                    <Td>{stage.label}</Td>
                    <Td>{stage.description}</Td>
                    <Td>
                      {stage?.isDefault ? "Hệ thống" : userInfo?.displayName}
                    </Td>
                    <Td>
                      {stage?.createdAt
                        ? format(stage?.createdAt?.toDate(), "dd-MM-yyyy")
                        : ""}
                    </Td>
                    <Td>
                      {stage?.updatedAt
                        ? format(stage?.updatedAt?.toDate(), "dd-MM-yyyy")
                        : ""}
                    </Td>
                    <Td>
                      <Badge colorScheme={stage.colorChema} userSelect="none">
                        {stage.label}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </TableContainer>
      </Box>
      <AddTaskModal
        isOpen={openModal}
        handleClose={handleCloseModal}
        onSubmit={handleSubmitOnModal}
        data={selectedStage}
        disableField={["task"]}
        onViewMode={onView}
      />
    </SlideFade>
  );
};

export default ChangeStage;
