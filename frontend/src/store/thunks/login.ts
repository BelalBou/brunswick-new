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
    // On indique que le login est un succès si on a un user et un token
    dispatch(setLoginSuccess(!!res.data.user && !!res.data.token));

    if (!res.data.user || !res.data.token) {
      dispatch(setLoginError("Login failed!"));
    } else {
      // Récupération du token
      const userToken = res.data.token;

      // Mise à jour de l'utilisateur via notre thunk userDispatch
      dispatch(userDispatch(res.data.user, userToken, emailAddress, password));
    }
  };
}

export const login = (emailAddress: string, password: string) => async (dispatch: Function) => {
  dispatch(setLoginPending(true));
  dispatch(setLoginSuccess(false));
  dispatch(setLoginError(""));

  try {
    console.log('Tentative de connexion avec:', { emailAddress });
    const res = await axios.post(`/api/auth/login`, { emailAddress, password });
    console.log('Réponse du serveur:', res.data);
    dispatch(loginDispatch(res, emailAddress, password));
  } catch (err: any) {
    console.error('Erreur de connexion:', err);
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
