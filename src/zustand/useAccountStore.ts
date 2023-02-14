import create from "zustand";
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  AuthErrorCodes,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { devtools, persist } from "zustand/middleware";
import { currentFirebaseAuth } from "../config/firebase";
import { toastError, toastSuccess } from "../helper/toast";
import { ChangePasswordBody, LoginBody, Userinfo } from "./type";
import { ErrorData } from "@firebase/util";
import { FirebaseErrorMessage } from "../constants/errorMessage.const";
import { LoginByPhoneBody } from "../constants/validate.const";
import { WEB_MESSAGE } from "../constants/message.const";

interface AccountStore {
  firebaseToken: string;
  userInfo: Userinfo | null;
  mode: "dark" | "light" | "system";
  loading: boolean;
  userObject: User | null;
  errors: string;
  logout: () => void;
  login: (body: LoginBody, onSuccess: () => void) => void;
  createAccount: (body: LoginBody) => void;
  changePassword: (body: ChangePasswordBody) => void;
  clearErrors: () => void;
  googleSignin: (onSuccess?: () => void) => void;
  requestPasswordReset: (params: Pick<LoginBody, "email">) => void;
  loginWithPhoneNumber: (
    params: LoginByPhoneBody
  ) => Promise<ConfirmationResult | null>;
  verificationLoginPhone: (userInfo: User, onSuccess?: () => void) => void;
  clearAccountStore: () => void;
  setAccountStore: (params: Partial<AccountStore>) => void;
}

const defaultErrorLog =
  (
    type: "login" | "sign-up" | "change-password" | "psw-recover" | "logout",
    set: Function
  ) =>
  (e: ErrorData) => {
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

const useAccountStore = create<AccountStore>()(
  persist(
    devtools((set) => ({
      firebaseToken: "",
      userInfo: null,
      mode: "dark",
      loading: false,
      userObject: null,
      errors: "",
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
          .catch(defaultErrorLog("logout", set))
          .finally(() => {
            set((state) => ({ ...state, loading: false }));
          });
      },
      login: async ({ email, password }, onSuccess) => {
        set((state) => ({ ...state, loading: true, errors: "" }));
        signInWithEmailAndPassword(currentFirebaseAuth, email, password)
          .then(async (response) => {
            const { user } = response;
            toastSuccess({
              title: `Chào mừng quay trở lại ${
                user.displayName || email.split("@")[0]
              }`,
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
            onSuccess?.();
          })
          .catch(defaultErrorLog("login", set))
          .finally(() => {
            set((state) => ({ ...state, loading: false }));
          });
      },
      createAccount: async ({ email, password }) => {
        set((state) => ({ ...state, loading: true, errors: "" }));
        createUserWithEmailAndPassword(currentFirebaseAuth, email, password)
          .then(async (response) => {
            const { user } = response;
            toastSuccess({
              title: `Chúc bạn có một ngày tốt lành, ${
                user.displayName || email.split("@")[0]
              }`,
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
          .catch(defaultErrorLog("sign-up", set))
          .finally(() => {
            set((state) => ({ ...state, loading: false }));
          });
      },
      changePassword: async ({ password, user, oldPassword }) => {
        set((state) => ({ ...state, loading: false, errors: "" }));
        const credential = EmailAuthProvider.credential(
          user.email as string,
          oldPassword
        );

        try {
          if (currentFirebaseAuth && currentFirebaseAuth.currentUser !== null) {
            await reauthenticateWithCredential(
              currentFirebaseAuth.currentUser,
              credential
            );
          }
        } catch (error: any) {
          console.log(error?.message);
          if (
            String(error.message)?.includes(AuthErrorCodes.INVALID_PASSWORD)
          ) {
            return set((state: AccountStore) => ({
              ...state,
              loading: false,
              errors: "Mật khẩu sai vui lòng nhập lại",
            }));
          }

          return toastError({
            title: WEB_MESSAGE.COMMON_ERROR,
          });
        }

        updatePassword(user, password)
          .then((_response) => {
            toastSuccess({
              title: `Đổi mật khẩu thành công`,
            });
          })
          .catch(defaultErrorLog("change-password", set))
          .finally(() => {
            set((state) => ({ ...state, loading: false }));
          });
      },
      clearErrors: () =>
        set((state) => ({ ...state, loading: false, errors: "" })),
      googleSignin: async (onSuccess) => {
        const google = new GoogleAuthProvider();

        set((state) => ({ ...state, loading: true, errors: "" }));
        signInWithPopup(currentFirebaseAuth, google)
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
            onSuccess?.();
          })
          .catch(defaultErrorLog("login", set))
          .finally(() => {
            set((state) => ({ ...state, loading: false }));
          });
      },
      requestPasswordReset: ({ email }) => {
        set((state) => ({ ...state, loading: true, errors: "" }));
        sendPasswordResetEmail(currentFirebaseAuth, email)
          .then(() => {
            toastSuccess({
              title: `Đã gửi thư đến email: ${email}, hãy kiểm tra hòm thư`,
            });
          })
          .catch(defaultErrorLog("psw-recover", set))
          .finally(() => {
            set((state) => ({ ...state, loading: false }));
          });
      },
      loginWithPhoneNumber: async ({ telephone }) => {
        set((state) => ({ ...state, errors: "" }));

        const formatPhoneNum = `+84${telephone}`;
        const applicationVerifier = new RecaptchaVerifier(
          "capchaContainer",
          {},
          currentFirebaseAuth
        );

        try {
          const confirmationResult = await signInWithPhoneNumber(
            currentFirebaseAuth,
            formatPhoneNum,
            applicationVerifier
          );

          toastSuccess({
            title: "Mã xác nhận đã được gửi đi hãy kiểm tra điện thoại",
          });

          return confirmationResult;
        } catch (error: any) {
          if (
            String(error.message)?.includes(FirebaseErrorMessage.WRONG_PHONE)
          ) {
            const message = "Số điện thoại không đúng yêu cầu";
            set((state) => ({ ...state, errors: message }));

            toastError({
              title: message,
            });
          }

          return null;
        }
      },
      verificationLoginPhone: async (user, onSuccess) => {
        toastSuccess({
          title: `Chào mừng quay trở lại ${user.displayName || ""}`,
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
        onSuccess?.();
      },
      clearAccountStore: () => {
        set({
          firebaseToken: "",
          userInfo: null,
          mode: "dark",
          loading: false,
          errors: "",
        });
      },
      setAccountStore: (params: Partial<AccountStore>) =>
        set((state) => ({ ...state, ...params })),
    })),
    {
      name: "accountStore",
    }
  )
);

export default useAccountStore;
