import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Collapse,
  Text,
  Box,
  Alert,
  AlertIcon,
  Badge,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect, useMemo } from "react";

import {
  CreateTaskOrTypeBody,
  CreateTaskOrTypeSchema,
} from "../../../constants/validate.const";
import InputForm from "../../../components/Form/InputForm/InputForm";
import TextAreaForm from "../../../components/Form/TextAreaForm/TextAreaForm";
import SelectForm from "../../../components/Form/SelectForm/SelectForm";
import { format } from "date-fns";
import { TAG_COLOR } from "../../../constants/color.const";
import TagsInput, { TagOption } from "../../../components/TagsInput/TagsInput";
import useStageStore from "../../../zustand/useStageStore";
import { useZodForm } from "../../../hooks/useZodForm";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  data?: Partial<CreateTaskOrTypeBody>;
  onSubmit: (data: CreateTaskOrTypeBody) => void;
  disableField?: Array<"task" | "tag">;
  onViewMode?: boolean;
}

const addTaskDefaultValues = {
  type: "task" as "task" | "tag",
  startDate: format(new Date(), "yyyy-MM-dd"),
  colorTag: TAG_COLOR[1],
};

const AddTaskModal: FC<Props> = ({
  handleClose,
  isOpen,
  data,
  onSubmit,
  disableField,
  onViewMode = false,
}) => {
  const allStage = useStageStore((state) => state.allStage);

  const stageOptions = useMemo<TagOption[]>(
    () =>
      allStage?.map((stage) => ({
        color: stage.colorChema || "",
        id: stage.id || crypto.randomUUID(),
        label: stage.label,
      })) || [],
    [allStage]
  );

  const {
    register,
    watch,
    reset,
    setValue,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useZodForm<CreateTaskOrTypeBody>(
    CreateTaskOrTypeSchema,
    addTaskDefaultValues,
    (form) => {
      onSubmit(form);
      handleClose();
    }
  );

  const typeWatch = watch("type");
  const colorWatch = watch("colorTag");
  const tagWatch = watch("innerTag");
  const nameWatch = watch("name");

  const handleCloseInternal = useCallback(() => {
    handleClose();
    reset(
      { type: "task" },
      {
        keepDirty: false,
        keepErrors: false,
        keepTouched: false,
      }
    );
  }, [handleClose, reset]);

  const dataTags = useMemo(() => {
    if (!tagWatch) {
      return [];
    }

    return tagWatch
      ?.map((tagId) => {
        const indexFound = allStage.findIndex((child) => child.id === tagId);

        if (indexFound) {
          return allStage[indexFound];
        }
        return null;
      })
      ?.filter((i) => i !== null) as any;
  }, [allStage, tagWatch]);

  useEffect(() => {
    const type = data?.type || "task";
    const id = data?.id;
    const name = data?.name || "";
    const description = data?.description || "";
    const colorTag = data?.colorTag || TAG_COLOR[1];
    const startDate = data?.startDate || format(new Date(), "yyyy-MM-dd");
    const endDate = data?.endDate || "";
    const innerTag = data?.innerTag || [];

    setValue("type", type);
    setValue("id", id);
    setValue("name", name);
    setValue("description", description);
    setValue("colorTag", colorTag);
    setValue("startDate", startDate);
    setValue("endDate", endDate);
    setValue("innerTag", innerTag);
  }, [data, setValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseInternal}
      closeOnOverlayClick
      closeOnEsc
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          backgroundColor="green.400"
          color="white"
          borderTopRadius="6px"
          display="flex"
          alignItems="center"
          py="2"
        >
          <Text fontSize="lg">
            {typeWatch === "task" ? "Vi???c c???n l??m" : "Giai ??o???n"}
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody pt="5">
          <Stack spacing={2} direction="column">
            <SelectForm
              errMessage={errors?.type?.message}
              register={register}
              label="Ki???u"
              name="type"
              displayType="inline"
              options={[
                {
                  label: "Vi???c c???n l??m",
                  value: "task",
                  disabled: disableField && disableField.includes("task"),
                },
                {
                  label: "Giai ??o???n",
                  value: "tag",
                  disabled: disableField && disableField.includes("tag"),
                },
              ]}
              disabled={onViewMode}
            />

            <InputForm
              errMessage={errors?.name?.message}
              register={register}
              label="T??n"
              name="name"
              isRequired
              displayType="inline"
              disabled={onViewMode}
            />

            <TextAreaForm
              errMessage={errors?.description?.message}
              register={register}
              label="Ch?? th??ch"
              name="description"
              displayType="inline"
              disabled={onViewMode}
            />

            <Collapse in={typeWatch === "tag"} animateOpacity>
              <Box display="flex" mt="3">
                <Text
                  color="blackAlpha.600"
                  fontSize="15px"
                  w="130px"
                  fontWeight="500"
                >
                  M??u s???c
                </Text>

                <Box display="flex" flex={1}>
                  <Box
                    boxSize="100px"
                    background={colorWatch}
                    boxShadow="md"
                    borderRadius="5px"
                    transition="all 0.2s ease-in"
                  />
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    flex={1}
                    justifyContent="space-between"
                    alignItems="center"
                    pl="10"
                  >
                    {TAG_COLOR.map((color) => (
                      <Box
                        backgroundColor={color}
                        key={color}
                        width="40px"
                        height="40px"
                        borderRadius="5px"
                        marginRight="2"
                        position="relative"
                        cursor={!onViewMode ? "pointer" : "not-allowed"}
                        pointerEvents={onViewMode ? "none" : "auto"}
                        onClick={() =>
                          setValue("colorTag", color, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: false,
                          })
                        }
                      >
                        {colorWatch === color ? (
                          <Box
                            position="absolute"
                            boxSize="10px"
                            backgroundColor="green.400"
                            rounded="full"
                            top="-0.5"
                            right="-0.6"
                          />
                        ) : null}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Alert
                status="info"
                mt="5"
                display="flex"
                alignItems="center"
                variant="solid"
              >
                <AlertIcon />
                Giai ??o???n c???a b???n s??? tr??ng nh?? th??? n??y:
                <Badge colorScheme={colorWatch} ml="auto" fontSize="15px">
                  {nameWatch ?? "Sample"}
                </Badge>
              </Alert>
            </Collapse>
            <Collapse in={typeWatch === "task"} animateOpacity>
              <InputForm
                errMessage={errors?.startDate?.message}
                register={register}
                label="Ng??y b???t ?????u"
                name="startDate"
                displayType="inline"
                type="date"
                disable
              />

              <InputForm
                errMessage={errors?.endDate?.message}
                register={register}
                label="Ng??y k???t th??c"
                name="endDate"
                isRequired
                displayType="inline"
                type="date"
                disable={onViewMode}
              />
              <Box display="flex" mt="3" alignItems="center">
                <Text
                  color="blackAlpha.600"
                  fontSize="15px"
                  w="130px"
                  fontWeight="500"
                >
                  Th??? li??n quan
                </Text>
                <Box flex={1}>
                  <TagsInput
                    tagOption={stageOptions}
                    name="innerTag"
                    setValue={setValue}
                    selectedData={dataTags}
                  />
                </Box>
              </Box>
            </Collapse>
          </Stack>
        </ModalBody>
        <ModalFooter>
          {!onViewMode ? (
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleSubmit}
              disabled={Object.keys(dirtyFields).length === 0}
            >
              {data?.name ? "C???p nh???t" : "T???o m???i"}
            </Button>
          ) : null}
          <Button
            onClick={handleCloseInternal}
            variant="ghost"
            color="blackAlpha.600"
          >
            H???y
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
