export enum PATH {
  HOME = "/home",
  NOT_FOUND = "/not-found",
  DASHBOARD = "/dashboard",
  USER_CUSTOMIZE = "/user-customize",
  USER_PROFILE = "/user-profile",
  TODO = "/todo",
  SIGN_UP = "/sign-up",
  SIGN_IN = "/sign-in",
  PSW_RECOVER = "/psw-recover",
  TODO_DETAIL = "/todo-detail",
}

export const HIDDEN_MENU_PATH = [
  PATH.NOT_FOUND,
  PATH.SIGN_UP,
  PATH.PSW_RECOVER,
  PATH.SIGN_IN,
  // PATH.TODO,
];
