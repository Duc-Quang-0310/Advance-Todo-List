import { Kbd } from "@chakra-ui/react";
import { Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { useAdsblock } from "./hooks/useAdsblock";
import { Routers } from "./config/router";
import { HIDDEN_MENU_PATH, PATH } from "./constants/path.const";
import NavigationMenu from "./components/Navigation/NavigationMenu";
import LoadingFallBack from "./components/LoadingFallBack/LoadingFallBack";
import useAccountStore from "./zustand/useAccountStore";
import useFirebaseAuth from "./hooks/useFirebaseAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function App() {
  const { hasAdblock } = useAdsblock();
  const userInfo = useAccountStore((state) => state.userInfo);
  useFirebaseAuth();

  if (hasAdblock) {
    return (
      <div className="adblockContainer">
        <Kbd>403</Kbd>
        <span>Bạn hãy tắt Adsblock để sử dụng trang web này</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={userInfo ? PATH.HOME : PATH.SIGN_IN} />}
        />

        {Routers()?.length > 0 &&
          Routers().map(({ component, path, preRenderFunc }) => (
            <Route
              path=""
              element={
                HIDDEN_MENU_PATH.includes(path) ? (
                  <Suspense fallback={<LoadingFallBack />}>
                    <Outlet />
                  </Suspense>
                ) : (
                  <NavigationMenu />
                )
              }
              key={path}
            >
              <Route
                element={component}
                path={path}
                action={preRenderFunc}
                key={path + crypto.randomUUID()}
                id={path}
              />
            </Route>
          ))}

        <Route path="*" element={<Navigate to={PATH.NOT_FOUND} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
