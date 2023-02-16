import { toastError } from "./../helper/toast";
import { useCallback, useEffect, useState } from "react";
import { ref, getDownloadURL, StorageReference } from "firebase/storage";
import { storage } from "../config/firebase";

export const useFirebaseImg = (storeRef?: StorageReference) => {
  const [firebaseImg, setFirebaseImg] = useState("");

  const getImgLink = useCallback((child: string | StorageReference) => {
    if (typeof child === "string") {
      const storageRef = ref(storage, child);
      getDownloadURL(storageRef)
        .then((response) => {
          setFirebaseImg(response);
          return response;
        })
        .catch((e) => {
          toastError({
            title: "Lấy ảnh thất bại vui lòng thử lại sau",
          });
          return "";
        });
    } else {
      getDownloadURL(child)
        .then((response) => {
          setFirebaseImg(response);
          return response;
        })
        .catch((e) => {
          toastError({
            title: "Lấy ảnh thất bại vui lòng thử lại sau",
          });
          return "";
        });
    }
  }, []);

  useEffect(() => {
    if (storeRef) {
      getDownloadURL(storeRef)
        .then((response) => setFirebaseImg(response))
        .catch((e) =>
          toastError({
            title: "Lấy ảnh thất bại vui lòng thử lại sau",
          })
        );
    }
    return () => {
      setFirebaseImg("");
    };
  }, [storeRef]);

  return { firebaseImg, getImgLink, setFirebaseImg };
};
