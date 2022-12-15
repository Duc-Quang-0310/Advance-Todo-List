import create, { StoreApi, UseBoundStore } from "zustand";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  UserInfo,
  UserMetadata,
  createUserWithEmailAndPassword,
  updatePassword,
  User,
} from "firebase/auth";
import { firebaseApp } from "../config/firebase";
import { toastError, toastSuccess } from "../helper/toast";
import { ChangePasswordBody, LoginBody, Userinfo } from "./type";

type AccountStore = UseBoundStore<
  StoreApi<{
    firebaseToken: string;
    userInfo: Userinfo | null;
    mode: "dark" | "light" | "system";
    loading: boolean;
    userObject: User | null;
  }>
>;

const currentFirebaseAuth = getAuth(firebaseApp);

const defaultErrorLog = (e: any) => {
  const message = e?.data?.message || "Có lỗi xảy ra vui lòng thử lại sau";
  toastError({
    title: message,
  });
};

const useAccountStore: AccountStore = create((set) => ({
  firebaseToken: "",
  userInfo: null,
  mode: "dark",
  loading: false,
  userObject: null,
  logout: () => {
    set((state) => ({ ...state, loading: true }));
    signOut(currentFirebaseAuth)
      .then(() => {
        toastSuccess({
          title: "Đăng xuất thành công khỏi hệ thống",
        });
        set({
          firebaseToken: "",
          userInfo: null,
          mode: "system",
        });
      })
      .catch(defaultErrorLog)
      .finally(() => {
        set((state) => ({ ...state, loading: false }));
      });
  },
  login: async ({ email, password }: LoginBody) => {
    set((state) => ({ ...state, loading: true }));
    signInWithEmailAndPassword(currentFirebaseAuth, email, password)
      .then(async (response) => {
        const { user } = response;
        toastSuccess({
          title: `Chào mừng quay trở lại ${user.displayName}`,
        });
        const currentToken = await user.getIdToken();
        set((state) => ({
          ...state,
          firebaseToken: currentToken,
          userInfo: {
            email: user.email,
            userID: user.providerId || user.uid,
            displayName: user.displayName,
            avatar: user.photoURL,
            provider: {
              data: user.providerData,
              id: user.providerId,
            },
            metadata: user.metadata,
            isAnonymus: user.isAnonymous,
            phoneNumber: user.phoneNumber,
            isEmailVerified: user.emailVerified,
          },
        }));
      })
      .catch(defaultErrorLog)
      .finally(() => {
        set((state) => ({ ...state, loading: false }));
      });
  },
  createAccount: async ({ email, password }: LoginBody) => {
    set((state) => ({ ...state, loading: true }));
    createUserWithEmailAndPassword(currentFirebaseAuth, email, password)
      .then(async (response) => {
        const { user } = response;
        toastSuccess({
          title: `Chúc bạn có một ngày tốt lành, ${user.displayName}`,
        });
        const currentToken = await user.getIdToken();
        set((state) => ({
          ...state,
          firebaseToken: currentToken,
          userInfo: {
            email: user.email,
            userID: user.providerId || user.uid,
            displayName: user.displayName,
            avatar: user.photoURL,
            provider: {
              data: user.providerData,
              id: user.providerId,
            },
            metadata: user.metadata,
            isAnonymus: user.isAnonymous,
            phoneNumber: user.phoneNumber,
            isEmailVerified: user.emailVerified,
          },
        }));
      })
      .catch(defaultErrorLog)
      .finally(() => {
        set((state) => ({ ...state, loading: false }));
      });
  },
  changePassword: ({ password, user }: ChangePasswordBody) => {
    set((state) => ({ ...state, loading: true }));
    updatePassword(user, password)
      .then((_response) => {
        toastSuccess({
          title: `Đổi mật khẩu thành công`,
        });
      })
      .catch(defaultErrorLog)
      .finally(() => {
        set((state) => ({ ...state, loading: false }));
      });
  },
}));

export default useAccountStore;
