import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Divider,
  Text,
  Wrap,
  Fade,
  Button,
} from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { UseFormSetValue } from "react-hook-form/dist/types";

export interface TagOption {
  label: string;
  color: string;
  id: string;
}

interface Props {
  tagOption: TagOption[];
  selectedData?: TagOption[];
  name?: string;
  setValue?: UseFormSetValue<any>;
  onChange?: (e: string[] | string) => void;
  singleSelect?: boolean;
}

const TagsInput: FC<Props> = ({
  tagOption,
  selectedData,
  name,
  setValue,
  onChange,
  singleSelect,
}) => {
  const [selectedTag, setSelectedTag] = useState<TagOption[]>(
    selectedData || []
  );
  const [tags, setTags] = useState<TagOption[]>(tagOption);

  const handleClickAddOption = useCallback(
    (id: string) => {
      const currentTagById = tags?.find((tag) => tag?.id === id);
      let newSelectedTags: TagOption[] | string;
      const newTags: TagOption[] = singleSelect
        ? tagOption?.filter((tag) => tag?.id !== id)
        : tags?.filter((tag) => tag?.id !== id);

      if (singleSelect) {
        newSelectedTags = currentTagById ? [currentTagById] : [];
      } else {
        newSelectedTags = currentTagById
          ? [...selectedTag, currentTagById]
          : [...selectedTag];
      }

      const dataChanges = singleSelect
        ? newSelectedTags[0].id
        : newSelectedTags.map((tag) => tag.id);

      setSelectedTag(newSelectedTags);
      setTags(newTags);
      onChange?.(dataChanges);

      if (name && setValue) {
        setValue(name, dataChanges);
      }
    },
    [name, onChange, selectedTag, setValue, singleSelect, tagOption, tags]
  );

  const handleDeleteOption = useCallback(
    (id: string) => {
      const currentTagById = selectedTag?.find((tag) => tag?.id === id);

      if (currentTagById) {
        setSelectedTag((prev) => [...prev].filter((tag) => tag.id !== id));
        setTags((prev) => [...prev, currentTagById]);
      }

      const newSelectedTags = [...selectedTag]
        .filter((tag) => tag.id === id)
        .map((tag) => tag?.id);

      if (name) {
        setValue?.(name, newSelectedTags);
      }

      onChange?.(newSelectedTags);
    },
    [name, onChange, selectedTag, setValue]
  );

  const handleClickClearAllOption = useCallback(() => {
    setSelectedTag([]);
    setTags(tagOption);
    if (name && setValue) {
      setValue(name, singleSelect ? "" : []);
    }
    onChange?.(singleSelect ? "" : []);
  }, [name, onChange, setValue, singleSelect, tagOption]);

  return (
    <Box>
      <Wrap>
        {tags?.length > 0 &&
          tags.map(({ color, id, label }, index) => (
            <>
              <Badge
                colorScheme={color}
                key={id}
                display="flex"
                alignItems="center"
                cursor="pointer"
                onClick={() => handleClickAddOption(id)}
              >
                {label}
              </Badge>
              {index !== tags?.length - 1 ? (
                <Divider orientation="vertical" height="20px" />
              ) : null}
            </>
          ))}
      </Wrap>
      <Box
        px="4"
        py="2"
        borderRadius="lg"
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="green.500"
        mt="4"
      >
        <Box display="flex" justifyContent="space-between">
          <Text
            textDecoration="underline"
            fontSize="13px"
            color="blue.500"
            fontWeight="600"
            userSelect="none"
          >
            Đang chọn :
          </Text>
          <Fade in={selectedTag.length > 0}>
            <Button
              colorScheme="red"
              variant="link"
              fontSize="13px"
              userSelect="none"
              onClick={handleClickClearAllOption}
            >
              Xóa tất cả
            </Button>
          </Fade>
        </Box>

        <Fade in={selectedTag.length > 0}>
          <Wrap mt="2" mb="2">
            {selectedTag.map(({ color, id, label }) => (
              <Badge
                colorScheme={color}
                key={id}
                display="flex"
                alignItems="center"
                cursor="pointer"
              >
                {label}
                <SmallCloseIcon
                  onClick={() =>
                    singleSelect
                      ? handleClickClearAllOption()
                      : handleDeleteOption(id)
                  }
                />
              </Badge>
            ))}
          </Wrap>
        </Fade>
      </Box>
    </Box>
  );
};

export default TagsInput;
