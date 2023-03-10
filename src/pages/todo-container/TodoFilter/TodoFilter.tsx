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

import useStageStore from "../../../zustand/useStageStore";
import CollapseUI from "../../../components/CollapseUI/CollapseUI";
import TagsInput, { TagOption } from "../../../components/TagsInput/TagsInput";
import { FilteredFields, KanbanCol } from "../../../constants/utils.const";

interface Props {
  handleUpdateFilter: (filter: FilteredFields) => void;
  filter: FilteredFields;
  kanban: KanbanCol[];
}

const TodoFilter: FC<Props> = ({
  handleUpdateFilter,
  filter: filterd,
  kanban = [],
}) => {
  const allStage = useStageStore((state) => state.allStage);
  const [filter, setFilter] = useState<FilteredFields>(filterd);
  const [isOpen, setIsOpen] = useState(false);

  const stageOptions = useMemo<TagOption[]>(
    () =>
      allStage?.map((stage) => ({
        color: stage.colorChema || "",
        id: stage.id || crypto.randomUUID(),
        label: stage.label,
      })) || [],
    [allStage]
  );

  const filterData = useMemo(() => {
    const listStageIDs = filter?.stage?.map((stage) => stage) || [];
    const stageFilter = kanban?.filter((i) => listStageIDs.includes(i.id));

    const defaultStageFilter: TagOption[] = stageFilter
      ? stageFilter?.map((fil) => ({
          color: fil.labelColor,
          id: fil.id,
          label: fil.label,
        }))
      : [];

    const defaultTagFilter: TagOption[] = [];
    return {
      stage: defaultStageFilter,
      tag: defaultTagFilter,
    };
  }, [filter?.stage, kanban]);

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
            B??? l???c
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
              placeholder="T??n c??ng vi???c"
              borderRadius="md"
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </InputGroup>

          <CollapseUI
            title="Giai ??o???n"
            element={
              <TagsInput
                tagOption={stageOptions}
                onChange={(data) => {
                  setFilter((prev) => ({
                    ...prev,
                    stage: typeof data !== "string" ? data : [],
                  }));
                }}
                selectedData={filterData.stage}
              />
            }
            mt="6"
          />

          <CollapseUI
            title="Th??? li??n quan"
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
            title="Th???i gian"
            element={
              <>
                <Text
                  fontSize="14px"
                  mb="2"
                  color="blackAlpha.700"
                  fontWeight="600"
                >
                  Ng??y b???t ?????u
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
                  Ng??y k???t th??c
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
