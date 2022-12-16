import { useCallback, useEffect, useState } from "react";

export const useAdsblock = () => {
  const [hasAdblock, setHasAdblock] = useState(false);

  const adDetech = useCallback(async () => {
    const greenKey = "_ga";
    const cookie = document.cookie;
    const splitedCookie = cookie.split(";");
    const ifHaveUnblockedKey = splitedCookie.some((value) =>
      value.includes(greenKey)
    );

    if (!ifHaveUnblockedKey) {
      setHasAdblock(true);
      return alert("Bạn cần tắt Adsblock để tiếp tục truy cập");
    }

    import("../config/firebase").then((response) => response.default);
  }, []);

  useEffect(() => {
    adDetech();
  }, []);

  return { hasAdblock };
};
