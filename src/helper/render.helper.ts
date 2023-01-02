export const filteredWeatherDetail = {
  temperature: "temperature",
  humidity: "humidity",
  air: "air",
};

export type FilteredWeatherDetail = keyof typeof filteredWeatherDetail;

export const renderBtnVariant = (key: string, filter: string) => {
  if (filter === key) {
    return "solid";
  }

  return "ghost";
};

export const renderWeatherDisplayTitle = (title: FilteredWeatherDetail) => {
  switch (title) {
    case "air":
      return "Tốc độ gió";
    case "humidity":
      return "Độ ẩm";
    case "temperature":
      return "Nhiệt độ";
    default:
      return "";
  }
};
