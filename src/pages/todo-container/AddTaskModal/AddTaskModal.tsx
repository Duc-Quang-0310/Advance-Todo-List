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
  FormErrorMessage,
  FormControl,
  FormLabel,
  Select,
  Input,
  Textarea,
  Collapse,
  Text,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useCallback } from "react";

import {
  CreateTaskOrTypeBody,
  CreateTaskOrTypeSchema,
} from "../../../constants/validate.const";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

const AddTaskModal: FC<Props> = ({ handleClose, isOpen }) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    reset,
  } = useForm<CreateTaskOrTypeBody>({
    mode: "all",
    resolver: zodResolver(CreateTaskOrTypeSchema),
    defaultValues: {
      type: "task",
      startDate: undefined,
    },
  });

  console.log("errors", errors);

  const typeWatch = watch("type");

  const renderContextError = useCallback(
    (field: keyof CreateTaskOrTypeBody) =>
      errors?.[field] ? (
        <FormErrorMessage>{errors?.[field]?.message}</FormErrorMessage>
      ) : null,
    [errors]
  );

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

  const renderRequired = useCallback(
    (label: string) => (
      <Box display="flex">
        {label}
        <Text color="red.600" fontWeight="bold">
          *
        </Text>
      </Box>
    ),
    []
  );

  const handleSubmitForm = useCallback((form: CreateTaskOrTypeBody) => {}, []);

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
        <ModalHeader>
          {typeWatch === "task" ? "Việc cần làm" : "Giai đoạn"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={2} direction="column">
            {/* <-- Type --> */}
            <FormControl isInvalid={!!errors?.type} display="flex">
              <FormLabel htmlFor="telephone" w="150px">
                Kiểu
              </FormLabel>
              <Select id="type" {...register("type")}>
                <option value="task">Việc cần làm</option>
                <option value="tag">Giai Đoạn</option>
              </Select>
            </FormControl>
            {/* <-- Type --> */}

            {/* <-- Name --> */}
            <FormControl isInvalid={!!errors?.name} display="flex">
              <FormLabel htmlFor="name" w="150px">
                {" "}
                {renderRequired("Tên")}
              </FormLabel>
              <Input id="name" size="md" {...register("name")} />
            </FormControl>
            {renderContextError("name")}
            {/* <-- Name --> */}

            {/* <-- Inner Tag --> */}
            <Collapse in={typeWatch === "tag"} animateOpacity>
              <FormControl isInvalid={!!errors?.colorTag} display="flex">
                <FormLabel htmlFor="colorTag" w="150px">
                  {renderRequired("Màu sắc")}
                </FormLabel>
                <Input id="colorTag" size="md" {...register("colorTag")} />
                {renderContextError("colorTag")}
              </FormControl>
            </Collapse>
            {/* <-- Inner Tag --> */}

            <Collapse in={typeWatch === "task"} animateOpacity>
              <FormControl isInvalid={!!errors?.innerTag} display="flex">
                <FormLabel htmlFor="innerTag" w="150px">
                  Thẻ liên quan
                </FormLabel>
                <Input id="innerTag" size="md" {...register("innerTag")} />
              </FormControl>

              <FormControl
                isInvalid={!!errors?.startDate}
                display="flex"
                py="2"
              >
                <FormLabel htmlFor="startDate" w="150px">
                  {" "}
                  Ngày bắt đầu
                </FormLabel>
                <Input
                  id="startDate"
                  size="md"
                  type="datetime-local"
                  disabled
                  {...register("startDate")}
                />
              </FormControl>

              <FormControl isInvalid={!!errors?.endDate} display="flex">
                <FormLabel htmlFor="endDate" w="150px">
                  {renderRequired("Ngày kết thúc")}
                </FormLabel>
                <Input
                  id="endDate"
                  size="md"
                  type="datetime-local"
                  {...register("endDate")}
                />
              </FormControl>
              {renderContextError("endDate")}
            </Collapse>

            {/* <-- Description --> */}
            <FormControl isInvalid={!!errors?.description} display="flex">
              <FormLabel htmlFor="description" w="150px">
                Chú thích
              </FormLabel>
              <Textarea
                id="description"
                size="md"
                {...register("description")}
              />
            </FormControl>
            {/* <-- Description --> */}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleSubmit(handleSubmitForm)}
          >
            Tạo mới
          </Button>
          <Button onClick={handleCloseInternal}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
