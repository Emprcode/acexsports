import { toast } from "react-toastify";
import { setUser } from "./UserSlice";
import {
  fetchNewAccessJWT,
  getUser,
  googleSignIn,
  logoutUser,
  updateUser,
} from "../../helper/axiosHelper";

//login with google
export const googleSignInAction = (user) => async (dispatch) => {
  const { status, message, tokens } = await googleSignIn(user);
  if (tokens?.accessJWT) {
    const { accessJWT, refreshJWT } = tokens;
    sessionStorage.setItem("accessJWT", accessJWT);
    localStorage.setItem("refreshJWT", refreshJWT);

    dispatch(getUserProfile());

    const { status, message, token, rest } = await googleSignIn(user);
    // console.log(status, message);

    if (status === "success" && token) {
      console.log(rest);
      dispatch(setUser(rest));
      sessionStorage.setItem("token", token);
      toast[status](message);
    }
    toast[status](message);
  }
};

//fetch user
export const getUserProfile = () => async (dispatch) => {
  const { status, user } = await getUser();
  if (status === "success" && user?._id) {
    dispatch(setUser(user));
  }
};

//update user

export const updateUserAction = (userDt) => async (dispatch) => {
  const { status, message, tokens } = await updateUser(userDt);
  if (tokens?.accessJWT) {
    const { accessJWT, refreshJWT } = tokens;
    sessionStorage.setItem("accessJWT", accessJWT);
    localStorage.setItem("refreshJWT", refreshJWT);

    dispatch(getUserProfile());
  }
  toast[status](message);
};

//auto login
export const autoLogin = () => async (dispatch) => {
  const accessJWT = sessionStorage.getItem("accessJWT");
  const refreshJWT = localStorage.getItem("refreshJWT");

  if (accessJWT) {
    return dispatch(getUserProfile());
  }
  if (refreshJWT) {
    const { status, accessJWT } = await fetchNewAccessJWT();
    if (status === "success" && accessJWT) {
      sessionStorage.setItem("accessJWT", accessJWT);
      dispatch(getUserProfile());
    }
  }
};

//logout user

export const logoutUserProfile = () => async (dispatch) => {
  dispatch(setUser({}));

  //calling axios to logout
  logoutUser();
  //remove token
  sessionStorage.removeItem("accessJWT");
  localStorage.removeItem("refreshJWT");
};
