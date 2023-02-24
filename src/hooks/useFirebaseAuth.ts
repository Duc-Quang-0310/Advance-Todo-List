import { useEffect } from "react";
import { firebaseAuth } from "../config/firebase";
import { PATH } from "../constants/path.const";
import useAccountStore from "../zustand/useAccountStore";

const useFirebaseAuth = () => {
  const setAccountStore = useAccountStore((state) => state.setAccountStore);

  useEffect(() => {
    const unregisterAuthObserver = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setAccountStore({
          userObject: user,
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
        });
      } else {
        setAccountStore({
          userObject: null,
          userInfo: null,
          firebaseToken: "",
          mode: "system",
          loading: false,
          errors: "",
        });

        if (window.location.pathname !== PATH.SIGN_IN) {
          window.location.pathname = PATH.SIGN_IN;
        }
      }
    });

    return () => unregisterAuthObserver();
  }, [setAccountStore]);
};

export default useFirebaseAuth;
