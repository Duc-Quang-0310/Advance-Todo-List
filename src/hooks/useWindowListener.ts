import { useCallback, useEffect } from "react";

export const useWindowListener = (
  cb: (e: any) => void,
  event: keyof WindowEventMap
) => {
  const callBackFunction = useCallback(
    (e: any) => {
      cb(e);
    },
    [cb]
  );

  useEffect(() => {
    window.addEventListener(event, (e) => callBackFunction(e));

    return () => {
      window.removeEventListener(event, callBackFunction);
    };
    // eslint-disable-next-line
  }, []);
};
