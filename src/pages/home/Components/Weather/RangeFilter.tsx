import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderMark,
  PopoverArrow,
  Text,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
} from "@chakra-ui/react";

import {
  FC,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  startTransition,
  useCallback,
} from "react";

interface Props {
  trigger: ReactNode;
  setLineChart: Dispatch<
    SetStateAction<{
      step: number;
      range: number[];
    }>
  >;
}

const RangeFilter: FC<Props> = ({ trigger, setLineChart }) => {
  const [sliderValue, setSliderValue] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChangeRange = useCallback(
    (e: number[]) => {
      startTransition(() => setLineChart((prev) => ({ ...prev, range: e })));
    },
    [setLineChart]
  );

  const handleChangeStep = useCallback(
    (v: number) => {
      setSliderValue(v);
      startTransition(() => setLineChart((prev) => ({ ...prev, step: v })));
    },
    [setLineChart]
  );

  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent paddingTop={2} paddingBottom={4} paddingInline={3}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text fontWeight="700" color="RGBA(0, 0, 0, 0.64)" paddingBottom={2}>
            Điều chỉnh
          </Text>
          <Box>
            <Text fontSize="small" color="RGBA(0, 0, 0, 0.56)">
              Mốc thời gian:
            </Text>
            <RangeSlider
              colorScheme="teal"
              defaultValue={[0, 23]}
              min={0}
              max={23}
              onChange={handleChangeRange}
            >
              <RangeSliderMark
                value={0}
                marginTop={2}
                fontSize="xs"
                color="RGBA(0, 0, 0, 0.48)"
              >
                0
              </RangeSliderMark>
              <RangeSliderMark
                value={23}
                marginTop={2}
                fontSize="xs"
                color="RGBA(0, 0, 0, 0.48)"
              >
                23
              </RangeSliderMark>
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </Box>

          <Box mt={5}>
            <Text fontSize="small" color="RGBA(0, 0, 0, 0.56)">
              Bước nhảy:
            </Text>
            <Slider
              aria-label="Bước nhảy"
              defaultValue={1}
              max={4}
              min={1}
              colorScheme="teal"
              onChange={handleChangeStep}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <SliderMark
                value={1}
                marginTop={2}
                fontSize="small"
                color="RGBA(0, 0, 0, 0.48)"
              >
                1
              </SliderMark>
              <SliderMark
                value={4}
                marginTop={2}
                fontSize="small"
                color="RGBA(0, 0, 0, 0.48)"
              >
                4
              </SliderMark>
              <SliderTrack bg="gray.200">
                <SliderFilledTrack bg="teal" />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="teal.500"
                color="white"
                placement="top"
                isOpen={showTooltip}
                label={`${sliderValue}`}
              >
                <SliderThumb>
                  <Box color="tomato" />
                </SliderThumb>
              </Tooltip>
            </Slider>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default RangeFilter;
