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
  updateProfile,
  reload,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { devtools, persist } from "zustand/middleware";
import {
  currentFirebaseAuth,
  firebaseAuth,
  firestore,
} from "../config/firebase";
import { toastError, toastSuccess } from "../helper/toast";
import {
  ChangePasswordBody,
  FirestoreSchema,
  LoginBody,
  Userinfo,
} from "./type";
import { FirebaseErrorMessage } from "../constants/errorMessage.const";
import { LoginByPhoneBody } from "../constants/validate.const";
import { WEB_MESSAGE } from "../constants/message.const";
import { getDefaultStageData } from "../helper/utils.helper";
import {
  defaultErrorLog,
  generateDefaultData,
  onUnAuthorized,
} from "../helper/zustand.helper";

export interface AccountStore {
  firebaseToken: string;
  userInfo: Userinfo | null;
  mode: "dark" | "light" | "system";
  loading: boolean;
  userObject: User | null;
  errors: string;
  logout: () => void;
  login: (body: LoginBody, onSuccess: () => void) => void;
  createAccount: (body: LoginBody) => void;
  changePassword: (body: ChangePasswordBody, onSuccess?: () => void) => void;
  clearErrors: () => void;
  googleSignin: (onSuccess?: () => void) => void;
  requestPasswordReset: (params: Pick<LoginBody, "email">) => void;
  loginWithPhoneNumber: (
    params: LoginByPhoneBody
  ) => Promise<ConfirmationResult | null>;
  verificationLoginPhone: (userInfo: User, onSuccess?: () => void) => void;
  clearAccountStore: () => void;
  setAccountStore: (params: Partial<AccountStore>) => void;
  updateCurrentProfile: (params: {
    displayName: string | null | undefined;
    photoURL: string | null | undefined;
    onSuccess?: () => void;
  }) => void;
  reUpdateUserData: (params: Partial<AccountStore>) => void;
}

const useAccountStore = create<AccountStore>()(
  persist(
    devtools((set, get) => ({
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
                userID: user.uid,
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
              userObject: user,
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
                userID: user.uid,
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
              userObject: user,
            }));
            const defaultData = getDefaultStageData(user.uid);

            await Promise.allSettled([
              setDoc(doc(firestore, FirestoreSchema.STAGE), defaultData[0]),
              setDoc(doc(firestore, FirestoreSchema.STAGE), defaultData[1]),
              setDoc(doc(firestore, FirestoreSchema.STAGE), defaultData[2]),
            ]);
          })
          .catch(defaultErrorLog("sign-up", set))
          .finally(() => {
            set((state) => ({ ...state, loading: false }));
          });
      },
      changePassword: async ({ password, oldPassword }, onSuccess) => {
        set((state) => ({ ...state, loading: false, errors: "" }));

        const userInfo = get().userInfo;
        const userObject = get().userObject;

        if (!userInfo || userInfo === null || !userObject) {
          return onUnAuthorized(set);
        }

        const credential = EmailAuthProvider.credential(
          userInfo?.email as string,
          oldPassword
        );

        try {
          await reauthenticateWithCredential(userObject, credential);
        } catch (error: any) {
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

        updatePassword(currentFirebaseAuth.currentUser as User, password)
          .then((_response) => {
            toastSuccess({
              title: `Đổi mật khẩu thành công`,
            });
            onSuccess?.();
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
                userID: user.uid,
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
            await generateDefaultData(user.uid);
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
            userID: user.uid,
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
        await generateDefaultData(user.uid);
        onSuccess?.();
      },
      clearAccountStore: () => {
        firebaseAuth.signOut();
        set({
          firebaseToken: "",
          userInfo: null,
          mode: "dark",
          loading: false,
          errors: "",
          userObject: null,
        });
      },
      setAccountStore: (params: Partial<AccountStore>) =>
        set((state) => ({ ...state, ...params })),
      updateCurrentProfile: ({ displayName, photoURL, onSuccess }) => {
        const user = get().userObject;

        if (!user || user === null) {
          return onUnAuthorized(set);
        }

        updateProfile(user, {
          displayName,
          photoURL,
        })
          .then((_res) => {
            onSuccess?.();
            toastSuccess({
              title: "Cập nhật thông tin thành công",
            });
          })
          .catch(defaultErrorLog("update-profile", set));
      },
      reUpdateUserData: async (params: Partial<AccountStore>) => {
        set((state) => ({ ...state, loading: true, errors: "" }));
        const user = get().userObject;

        if (!user || user === null) {
          return onUnAuthorized(set);
        }

        try {
          await reload(user);
          set((state) => ({ ...state, loading: false, ...params }));
        } catch (error) {
          toastError({
            title: "Cập nhật thông tin người dùng thất bại, vui lòng thử lại",
          });
        }
      },
    })),
    {
      name: "accountStore",
    }
  )
);

export default useAccountStore;
