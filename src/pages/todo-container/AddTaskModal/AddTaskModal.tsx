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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import TagsInput from "../../../components/TagsInput/TagsInput";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  data?: Partial<CreateTaskOrTypeBody>;
  onSubmit: (data: CreateTaskOrTypeBody) => void;
}

const MOCKS_TAG = [
  { color: "green", id: "1", label: "Label 1" },
  { color: "red", id: "2", label: "Label 2" },
  { color: "yellow", id: "3", label: "Label 3" },
];

const AddTaskModal: FC<Props> = ({ handleClose, isOpen, data, onSubmit }) => {
  const {
    handleSubmit,
    formState: { errors, isDirty },
    register,
    watch,
    reset,
    setValue,
  } = useForm<CreateTaskOrTypeBody>({
    mode: "all",
    resolver: zodResolver(CreateTaskOrTypeSchema),
    defaultValues: {
      type: "task",
      startDate: format(new Date(), "yyyy-MM-dd"),
      colorTag: TAG_COLOR[1],
    },
  });

  const typeWatch = watch("type");
  const colorWatch = watch("colorTag");
  const tagWatch = watch("innerTag");

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

  const handleSubmitForm = useCallback(
    (form: CreateTaskOrTypeBody) => {
      onSubmit(form);
      handleCloseInternal();
    },
    [handleCloseInternal, onSubmit]
  );

  const dataTags = useMemo(() => {
    if (!tagWatch) {
      return [];
    }

    return tagWatch
      ?.map((tagId) => {
        const indexFound = MOCKS_TAG.findIndex((child) => child.id === tagId);

        if (indexFound) {
          return MOCKS_TAG[indexFound];
        }
        return null;
      })
      ?.filter((i) => i !== null) as any;
  }, [tagWatch]);

  useEffect(() => {
    const type = data?.type || "task";
    const id = data?.id || crypto.randomUUID();
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
  }, [
    data?.colorTag,
    data?.description,
    data?.endDate,
    data?.id,
    data?.innerTag,
    data?.name,
    data?.startDate,
    data?.type,
    setValue,
  ]);

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
            {typeWatch === "task" ? "Việc cần làm" : "Giai đoạn"}
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody pt="5">
          <Stack spacing={2} direction="column">
            <SelectForm
              errMessage={errors?.type?.message}
              register={register}
              label="Kiểu"
              name="type"
              displayType="inline"
              options={[
                {
                  label: "Việc cần làm",
                  value: "task",
                },
                {
                  label: "Giai Đoạn",
                  value: "tag",
                },
              ]}
            />

            <InputForm
              errMessage={errors?.name?.message}
              register={register}
              label="Tên"
              name="name"
              isRequired
              displayType="inline"
            />

            <TextAreaForm
              errMessage={errors?.description?.message}
              register={register}
              label="Chú thích"
              name="description"
              displayType="inline"
            />

            <Collapse in={typeWatch === "tag"} animateOpacity>
              <Box display="flex" mt="3">
                <Text
                  color="blackAlpha.600"
                  fontSize="15px"
                  w="130px"
                  fontWeight="500"
                >
                  Màu sắc
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
                        cursor="pointer"
                        onClick={() => setValue("colorTag", color)}
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
                Giai đoạn của bạn sẽ trông như thế này:
                <Badge colorScheme={colorWatch} ml="auto" fontSize="15px">
                  Yeah
                </Badge>
              </Alert>
            </Collapse>
            <Collapse in={typeWatch === "task"} animateOpacity>
              <InputForm
                errMessage={errors?.startDate?.message}
                register={register}
                label="Ngày bắt đầu"
                name="startDate"
                displayType="inline"
                type="date"
                disable
              />

              <InputForm
                errMessage={errors?.endDate?.message}
                register={register}
                label="Ngày kết thúc"
                name="endDate"
                isRequired
                displayType="inline"
                type="date"
              />
              <Box display="flex" mt="3" alignItems="center">
                <Text
                  color="blackAlpha.600"
                  fontSize="15px"
                  w="130px"
                  fontWeight="500"
                >
                  Thẻ liên quan
                </Text>
                <Box flex={1}>
                  <TagsInput
                    tagOption={MOCKS_TAG}
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
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleSubmit(handleSubmitForm)}
            disabled={!isDirty}
          >
            Tạo mới
          </Button>
          <Button
            onClick={handleCloseInternal}
            variant="ghost"
            color="blackAlpha.600"
          >
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
