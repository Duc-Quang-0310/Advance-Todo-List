import { useAdsblock } from "./hooks/useAdsblock";
import { Kbd } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { Routers } from "./config/router";
import { PATH } from "./constants/path.const";

function App() {
  const { hasAdblock } = useAdsblock();

  if (hasAdblock) {
    return (
      <div className="adblockContainer">
        <Kbd>403</Kbd>
        <span>Bạn hãy tắt Adsblock để sử dụng trang web này</span>
      </div>
    );
  }

  return (
    <Suspense fallback={<div />}>
      <BrowserRouter>
        <Routes>
          {Routers().map(({ component, path, preRenderFunc }) => (
            <Route
              element={component}
              path={path}
              action={preRenderFunc}
              key={path}
              id={path}
            />
          ))}
          <Route path="*" element={<Navigate to={PATH.NOT_FOUND} />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
