import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../pages/authenticationPages/authSlice";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  let roles = [];
  let isLoggedIn = false;
  let isActive = false;
  let isAdmin = false;
  let isManager = false;
  let status = "User";

  if (token && user) {
    roles = user.roles || [];
    isLoggedIn = true;
    isActive = user.emailVerified;
    isAdmin = roles.includes("admin");
    isManager = roles.includes("manager");

    if (isAdmin) status = "Admin";
    else if (isManager) status = "Manager";

    return {
      token,
      roles,
      isLoggedIn,
      isActive,
      isAdmin,
      isManager,
      status,
      user,
      isLoading: false,
      isUninitialized: false,
    };
  }

  return {
    roles: [],
    isLoggedIn: false,
    isActive: false,
    isAdmin: false,
    isManager: false,
    status: "Guest",
    user: null,
    isLoading: false,
    isUninitialized: false,
  };
};

export default useAuth;
