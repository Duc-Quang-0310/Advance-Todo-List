import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useId,
  useMemo,
} from "react";
import { Kbd, Button, Box, Stack } from "@chakra-ui/react";
import { renderBtnVariant } from "../../../../helper/render.helper";

const mappedFields = {
  day: "day",
  "7day": "7day",
  month: "month",
  year: "year",
};

export type MappedFilterFields = keyof typeof mappedFields;

interface Props {
  title: string;
  disableFields?: Array<MappedFilterFields>;
  filter: MappedFilterFields;
  onChangeFilter: Dispatch<SetStateAction<MappedFilterFields>>;
}

const DateFilter: FC<Props> = ({
  title,
  disableFields,
  filter,
  onChangeFilter,
}) => {
  const id = useId();
  const renderTitle = useCallback((title: keyof typeof mappedFields) => {
    switch (title) {
      case "day":
        return "Ngày";
      case "7day":
        return "Tuần";
      case "month":
        return "Tháng";
      case "year":
        return "Năm";
      default:
        return "";
    }
  }, []);

  const onChange = useCallback(
    (key: MappedFilterFields) => () => {
      onChangeFilter(key);
    },
    [onChangeFilter]
  );

  const renderDateSelection = useMemo(() => {
    return Object.keys(mappedFields).map((key) => (
      <Button
        colorScheme="teal"
        variant={renderBtnVariant(key, filter)}
        key={key + id}
        disabled={disableFields?.some((i) => i === key)}
        size="xs"
        onClick={onChange(key as MappedFilterFields)}
      >
        {renderTitle(key as MappedFilterFields)}
      </Button>
    ));
  }, [disableFields, filter, id, onChange, renderTitle]);

  return (
    <Box display="flex" justifyContent="space-between" width="100%" key={id}>
      <Kbd fontSize={17} paddingBlock={1} paddingInline={3}>
        {title}
      </Kbd>
      <Stack direction="row" alignItems="center">
        {renderDateSelection}
      </Stack>
    </Box>
  );
};

export default DateFilter;
