import { useLocation, useNavigate, useParams } from "react-router";
import { PATH } from "../constants/path.const";

export const useBrowser = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { search: routeSearch, state: routeState, pathname } = useLocation();

  const pushHome = () => {
    navigate(PATH.HOME);
  };

  const pushDashboard = () => {
    navigate(PATH.DASHBOARD);
  };

  const pushTodo = () => {
    navigate(PATH.TODO);
  };

  const pushTodoDetail = (id: string) => {
    navigate(`${PATH.TODO_DETAIL}/${id}`);
  };

  const pushCustomize = () => {
    navigate(PATH.USER_CUSTOMIZE);
  };

  const pushSignIn = () => {
    navigate(PATH.SIGN_IN);
  };

  const pushSignUp = () => {
    navigate(PATH.SIGN_UP);
  };

  const pushPSWRecover = () => {
    navigate(PATH.PSW_RECOVER);
  };

  const pushProfile = () => {
    navigate(PATH.USER_PROFILE);
  };

  return {
    pathname,
    params,
    routeSearch,
    routeState,
    pushHome,
    pushDashboard,
    pushTodo,
    pushTodoDetail,
    pushCustomize,
    pushSignIn,
    pushSignUp,
    pushPSWRecover,
    pushProfile,
  };
};
