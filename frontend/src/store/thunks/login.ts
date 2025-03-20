// ./thunks/login.ts

import axios from "axios";

// 1) On importe les actions du slice login
import {
  setLoginPending,
  setLoginSuccess,
  setLoginError
} from "../slices/loginSlice";

// 2) On importe la fonction userDispatch 
//    (qui, par exemple, se trouve dans un fichier userThunks.ts).
import { userDispatch } from "./user"; // ou "../thunks/userThunks"

// 3) On importe aussi directement les autres actions du userSlice 
//    (si on souhaite les appeler manuellement, ex: logout).
import {
  setUserId,
  setUserFirstName,
  setUserLastName,
  setUserLanguage,
  setUserType,
  setUserSupplierId,
  setUserEmailAddress,
  setUserPassword,
  setUserToken
} from "../slices/userSlice";

// 4) On importe la fonction `setSelected` depuis pageSlice
import { setSelected } from "../slices/pageSlice";

// Authentification
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 * login
 */
function loginDispatch(res: any, emailAddress: string, password: string) {
  return (dispatch: Function) => {
    // On indique que le login est un succès si res.data.length > 0
    dispatch(setLoginSuccess(!!res.data.length));

    if (!res.data.length) {
      dispatch(setLoginError("Login failed!"));
    } else {
      // Récupération du token
      const userToken =
        res.data.length > 1 && res.data[1] && res.data[1].token
          ? res.data[1].token
          : "";

      // Mise à jour de l'utilisateur via notre thunk userDispatch
      dispatch(userDispatch(res.data[0], userToken, emailAddress, password));
    }
  };
}

export const login = (emailAddress: string, password: string) => async (dispatch: Function) => {
  dispatch(setLoginPending(true));
  dispatch(setLoginSuccess(false));
  dispatch(setLoginError(""));

  try {
    const res = await axios.post(`/api/users/login/`, { emailAddress, password });
    dispatch(loginDispatch(res, emailAddress, password));
  } catch (err: any) {
    dispatch(setLoginError(String(err)));
  } finally {
    dispatch(setLoginPending(false));
  }
};

/** ---------------------------
 * register
 */
export const register = (password: string, confirmPassword: string) => async (dispatch: Function) => {
  dispatch(setLoginPending(true));
  dispatch(setLoginSuccess(false));
  dispatch(setLoginError(""));

  try {
    const res = await axios.post(`/api/users/register/`, { password, confirmPassword });
    dispatch(setLoginSuccess(!!res.data));
    if (!res.data) {
      dispatch(setLoginError("Registration failed!"));
    }
  } catch (err: any) {
    dispatch(setLoginError(String(err)));
  } finally {
    dispatch(setLoginPending(false));
  }
};

/** ---------------------------
 * resetPassword
 */
export const resetPassword = (emailAddress: string) => async (dispatch: Function) => {
  dispatch(setLoginPending(true));
  dispatch(setLoginSuccess(false));
  dispatch(setLoginError(""));

  try {
    const res = await axios.post(`/api/users/reset-password/`, { emailAddress });
    dispatch(setLoginSuccess(!!res.data));
    if (!res.data) {
      dispatch(setLoginError("Password reset request failed!"));
    }
  } catch (err: any) {
    dispatch(setLoginError(String(err)));
  } finally {
    dispatch(setLoginPending(false));
  }
};

/** ---------------------------
 * logout
 */
export const logout = () => (dispatch: Function) => {
  // On remet tout à zéro dans le slice login
  dispatch(setLoginPending(false));
  dispatch(setLoginSuccess(false));
  dispatch(setLoginError(""));

  // On "reset" toutes les infos utilisateur
  dispatch(setUserId(-1));
  dispatch(setUserFirstName(""));
  dispatch(setUserLastName(""));
  dispatch(setUserLanguage("fr"));
  dispatch(setUserType(""));
  dispatch(setUserSupplierId(-1));
  dispatch(setUserEmailAddress(""));
  dispatch(setUserPassword(""));
  dispatch(setUserToken(""));

  // On remet la page sélectionnée à 1
  dispatch(setSelected(1));

  // On vide le storage
  localStorage.clear();
};
