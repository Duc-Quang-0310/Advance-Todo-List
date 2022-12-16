import { lazy, ReactNode } from "react";
import { ActionFunction } from "react-router-dom";

interface Router {
  component: ReactNode;
  path: string;
  preRenderFunc?: ActionFunction;
}

const NotFoundPage = lazy(() => import("../pages/404/404Page"));
const HomePage = lazy(() => import("../pages/home/Home"));

enum PATH {
  HOME = "/",
  NOT_FOUND = "/not-found",
}

export const Routers = (): Router[] => [
  {
    component: <NotFoundPage />,
    path: PATH.NOT_FOUND,
  },
  {
    component: <HomePage />,
    path: PATH.HOME,
  },
];
