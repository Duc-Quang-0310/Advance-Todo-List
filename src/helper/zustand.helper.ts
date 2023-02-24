import { ErrorData } from "@firebase/util";
import { AuthErrorCodes } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { firestore } from "../config/firebase";

import { WEB_MESSAGE } from "../constants/message.const";
import { PATH } from "../constants/path.const";
import { FirestoreSchema } from "../zustand/type";
import { AccountStore } from "../zustand/useAccountStore";
import { toastError } from "./toast";
import { getDefaultStageData } from "./utils.helper";

export type ErrorLogType =
  | "login"
  | "sign-up"
  | "change-password"
  | "psw-recover"
  | "logout"
  | "update-profile";

export function onUnAuthorized(set: Function) {
  toastError({
    title: WEB_MESSAGE.LOGIN_EXPIRED,
  });

  window.location.pathname = PATH.SIGN_IN;

  return set((state: AccountStore) => ({
    ...state,
    loading: false,
  }));
}

export const defaultErrorLog =
  (type: ErrorLogType, set: Function) => (e: ErrorData) => {
    console.log("String(e.message)", String(e.message));

    let message = "";

    if (String(e.message)?.includes(AuthErrorCodes.EMAIL_EXISTS)) {
      message = "Email đã tồn tại vui lòng nhập email khác";
    }

    if (String(e.message)?.includes(AuthErrorCodes.INVALID_PASSWORD)) {
      message = "Mật khẩu sai vui lòng nhập lại";
    }

    if (String(e.message)?.includes(AuthErrorCodes.USER_DELETED)) {
      message = "Email không tồn tại";
    }

    if (!message) {
      message = WEB_MESSAGE.COMMON_ERROR;
    }

    set((state: AccountStore) => ({
      ...state,
      loading: false,
      errors: message,
    }));

    toastError({
      title: message,
    });
  };

export const generateDefaultData = async (usrId: string) => {
  const stageRef = collection(firestore, FirestoreSchema.STAGE);

  const q = query(stageRef, where("userId", "==", usrId));

  const result = await getDocs(q);

  if (!result.empty) {
    return;
  }

  const defaultData = getDefaultStageData(usrId);

  return Promise.allSettled([
    addDoc(collection(firestore, FirestoreSchema.STAGE), defaultData[0]),
    addDoc(collection(firestore, FirestoreSchema.STAGE), defaultData[1]),
    addDoc(collection(firestore, FirestoreSchema.STAGE), defaultData[2]),
  ]);
};
