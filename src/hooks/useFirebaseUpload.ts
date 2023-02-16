import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { storage } from "../config/firebase";
import { WEB_MESSAGE } from "../constants/message.const";
import { ImageExtension } from "../constants/utils.const";
import { toastError, toastSuccess } from "../helper/toast";

const useFirebaseUpload = (storeRef?: StorageReference) => {
  const [fileLoading, setFileLoading] = useState(false);
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

  const handleUpload = useCallback(
    (path: string, files: FileList | null) => {
      if (fileLoading) {
        return toastError({
          title: "Có một quá trình tải lên đang diễn ra vui lòng đợi",
        });
      }

      if (files && (files?.length > 1 || files?.length === 0)) {
        return toastError({
          title: "Chỉ được tải một bức ảnh cùng một lúc, vui lòng thử lại",
        });
      }

      if (!files) {
        return toastError({
          title: WEB_MESSAGE.COMMON_ERROR,
        });
      }

      const currentFile = files[0];
      const fileSplit = files[0].name.split(".");
      const greenFileKey = Object.values(ImageExtension).map(
        (extension) => extension
      );

      if (!greenFileKey.includes(fileSplit[fileSplit.length - 1])) {
        return toastError({
          title: "File được đăng lên phải có định dạng ảnh, vui lòng thử lại",
        });
      }
      const storageRef = ref(storage, `${path}/${currentFile.name}`);

      setFileLoading(true);
      uploadBytes(storageRef, currentFile)
        .then((response) => {
          getImgLink(response.metadata.fullPath);
          toastSuccess({
            title: "Tải ảnh lên thành công",
          });
        })
        .catch((_err) => {
          toastError({
            title: "Tải ảnh lên thất bại, vui lòng thử lại sau",
          });
        })
        .finally(() => {
          setFileLoading(false);
        });
    },
    [fileLoading, getImgLink]
  );

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

  return { firebaseImg, setFirebaseImg, getImgLink, handleUpload, fileLoading };
};

export default useFirebaseUpload;
