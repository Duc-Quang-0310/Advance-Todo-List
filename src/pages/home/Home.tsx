import { useWeather } from "../../hooks/useWeather";

const Home = () => {
  const { getWeatherByRange } = useWeather();
  return <div onClick={() => getWeatherByRange({})}>Home</div>;
};

export default Home;
