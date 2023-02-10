import { lazy, ReactNode, useCallback } from "react";
import { ActionFunction } from "react-router-dom";
import { PATH } from "../constants/path.const";
import useAccountStore from "../zustand/useAccountStore";

interface Router {
  component: ReactNode;
  path: PATH;
  preRenderFunc?: ActionFunction;
}

const NotFoundPage = lazy(() => import("../pages/404/404Page"));
const HomePage = lazy(() => import("../pages/home/Home"));
const DashboardPage = lazy(() => import("../pages/dashboard/Dashboard"));
const UserCustomizePage = lazy(
  () => import("../pages/user-customize/UserCustomize")
);
const UserProfilePage = lazy(() => import("../pages/user-profile/UserProfile"));
const TodoPage = lazy(() => import("../pages/todo-container/TodoContainer"));
const SignInPage = lazy(() => import("../pages/sign-in/SignIn"));
const SignUpPage = lazy(() => import("../pages/sign-up/SignUp"));
const PSWRecoverPage = lazy(() => import("../pages/psw-recover/PSWRecover"));
const NotAuthorizedPage = lazy(
  () => import("../pages/Not-authorize/NotAuthorized")
);
const ToDoDetailPage = lazy(() => import("../pages/todo-detail/TodoDetail"));

export const Routers = (): Router[] => {
  const token = useAccountStore((state) => state.firebaseToken);

  const isAuthorized = useCallback(
    (children: ReactNode) => (token ? children : <NotAuthorizedPage />),
    [token]
  );

  return [
    {
      component: <NotFoundPage />,
      path: PATH.NOT_FOUND,
    },
    {
      component: isAuthorized(<HomePage />),
      path: PATH.HOME,
    },
    {
      component: isAuthorized(<DashboardPage />),
      path: PATH.DASHBOARD,
    },
    {
      component: isAuthorized(<ToDoDetailPage />),
      path: `${PATH.TODO_DETAIL}/:id`,
    },
    {
      component: isAuthorized(<UserCustomizePage />),
      path: PATH.USER_CUSTOMIZE,
    },
    {
      component: isAuthorized(<UserProfilePage />),
      path: PATH.USER_PROFILE,
    },
    {
      component: isAuthorized(<TodoPage />),
      path: PATH.TODO,
    },
    !token && {
      component: <SignInPage />,
      path: PATH.SIGN_IN,
    },
    !token && {
      component: <SignUpPage />,
      path: PATH.SIGN_UP,
    },
    !token && {
      component: <PSWRecoverPage />,
      path: PATH.PSW_RECOVER,
    },
  ].filter((route) => route) as Router[];
};
