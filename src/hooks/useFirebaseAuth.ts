import { useEffect } from "react";
import { firebaseAuth } from "../config/firebase";
import { WEB_MESSAGE } from "../constants/message.const";
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
        });
      } else {
        firebaseAuth.signOut();
        setAccountStore({
          userObject: null,
          userInfo: null,
        });
        alert(WEB_MESSAGE.LOGIN_EXPIRED);
        window.location.pathname = PATH.SIGN_IN;
      }
    });

    return () => unregisterAuthObserver();
  }, [setAccountStore]);
};

export default useFirebaseAuth;
