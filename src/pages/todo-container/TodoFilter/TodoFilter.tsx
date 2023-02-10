import { Search2Icon } from "@chakra-ui/icons";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  Icon,
  PopoverArrow,
  InputLeftAddon,
  PopoverContent,
  Input,
  Text,
  PopoverBody,
  PopoverCloseButton,
  InputGroup,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { FC, useMemo, useState, useCallback } from "react";
import { HiOutlineFilter } from "react-icons/hi";

import CollapseUI from "../../../components/CollapseUI/CollapseUI";
import TagsInput, { TagOption } from "../../../components/TagsInput/TagsInput";
import { FilteredFields, MOCK_COL_LABEL } from "../../../constants/utils.const";

interface Props {
  handleUpdateFilter: (filter: FilteredFields) => void;
  filter: FilteredFields;
}

const TodoFilter: FC<Props> = ({ handleUpdateFilter, filter: filterd }) => {
  const [filter, setFilter] = useState<FilteredFields>(filterd);
  const [isOpen, setIsOpen] = useState(false);

  const filterData = useMemo(() => {
    const stageFilter = MOCK_COL_LABEL?.find((i) => i.id === filter?.stage);

    const defaultStageFilter: TagOption[] = stageFilter
      ? [
          {
            color: stageFilter.labelColor,
            id: stageFilter.id,
            label: stageFilter.label,
          },
        ]
      : [];

    const defaultTagFilter: TagOption[] = [];
    return {
      stage: defaultStageFilter,
      tag: defaultTagFilter,
    };
  }, [filter?.stage]);

  console.log(
    "🚀 ~ file: TodoFilter.tsx:35 ~ filterData ~ filterData",
    filterData
  );

  const handleConfirm = useCallback(() => {
    handleUpdateFilter(filter);
    setIsOpen(false);
  }, [filter, handleUpdateFilter]);

  const handleOnClose = useCallback(() => {
    setIsOpen(false);

    setFilter(filterd);
  }, [filterd]);

  return (
    <Popover closeOnBlur={false} closeOnEsc={false} isOpen={isOpen} isLazy>
      <PopoverTrigger>
        <IconButton
          aria-label="Filter"
          icon={<Icon as={HiOutlineFilter} color="teal" />}
          boxShadow="md"
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </PopoverTrigger>
      <PopoverContent w="420px" px="2" py="3">
        <PopoverArrow />
        <PopoverCloseButton color="green.600" mt="3" onClick={handleOnClose} />
        <PopoverBody>
          <Text
            fontSize="16px"
            userSelect="none"
            fontWeight="600"
            color="green.600"
            mb="4"
            textTransform="uppercase"
          >
            Bộ lọc
          </Text>
          <InputGroup mt="3" size="sm">
            <InputLeftAddon
              children={<Search2Icon color="green.600" />}
              background="green.200"
              borderRadius="md"
              cursor="pointer"
              onClick={handleConfirm}
            />
            <Input
              type="string"
              placeholder="Tên công việc"
              borderRadius="md"
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </InputGroup>

          <CollapseUI
            title="Giai đoạn"
            element={
              <TagsInput
                tagOption={[
                  { color: "green", id: "To do", label: "Cần làm" },
                  {
                    color: "purple",
                    id: "In progress",
                    label: "Đang Tiến Hành",
                  },
                  { color: "red", id: "Done", label: "Kết thúc" },
                ]}
                onChange={(data) => {
                  setFilter((prev) => ({
                    ...prev,
                    stage: typeof data !== "string" ? "" : data,
                  }));
                }}
                singleSelect
                selectedData={filterData.stage}
              />
            }
            mt="6"
          />

          <CollapseUI
            title="Thẻ liên quan"
            element={
              <TagsInput
                tagOption={[
                  { color: "green", id: "1", label: "Label 1" },
                  { color: "red", id: "2", label: "Label 2" },
                  { color: "yellow", id: "3", label: "Label 3" },
                ]}
                onChange={(data) =>
                  setFilter((prev) => ({
                    ...prev,
                    tag: typeof data !== "string" ? data : [],
                  }))
                }
                selectedData={filterData.tag}
              />
            }
          />

          <CollapseUI
            title="Thời gian"
            element={
              <>
                <Text
                  fontSize="14px"
                  mb="2"
                  color="blackAlpha.700"
                  fontWeight="600"
                >
                  Ngày bắt đầu
                </Text>
                <Input
                  type="date"
                  size="sm"
                  color="blackAlpha.700"
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      startDate: format(new Date(e.target.value), "yyyy-MM-dd"),
                    }))
                  }
                />
                <Text
                  fontSize="14px"
                  mt="3"
                  mb="2"
                  color="blackAlpha.700"
                  fontWeight="600"
                >
                  Ngày kết thúc
                </Text>
                <Input
                  type="date"
                  size="sm"
                  color="blackAlpha.700"
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      endDate: format(new Date(e.target.value), "yyyy-MM-dd"),
                    }))
                  }
                />
              </>
            }
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default TodoFilter;
