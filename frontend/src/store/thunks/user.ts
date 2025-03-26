// ./thunks/userThunks.ts

import axios from "axios";
import { AppDispatch } from "../store"; // si tu as besoin du type Dispatch
import {
  setUserId,
  setUserFirstName,
  setUserLastName,
  setUserLanguage,
  setUserType,
  setUserSupplierId,
  setUserEmailAddress,
  setUserPassword,
  setUserToken,
  setUserList,
  setUserValidity
} from "../slices/userSlice";

// On importe par exemple ces actions si on veut afficher add/edit success/failure
import { setAddPending, setAddSuccess, setAddError } from "../slices/addSlice";
import { setEditPending, setEditSuccess, setEditError } from "../slices/editSlice";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "../slices/deleteSlice";
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

interface IUserData {
  id: number;
  first_name: string;
  last_name: string;
  language: string;
  type: string;
  supplier_id: number;
}

export function userDispatch(
  user: IUserData,
  userToken: string,
  emailAddress: string,
  password: string
) {
  return (dispatch: AppDispatch) => {
    dispatch(setUserId(user.id));
    dispatch(setUserFirstName(user.first_name));
    dispatch(setUserLastName(user.last_name));
    dispatch(setUserLanguage(user.language));
    dispatch(setUserType(user.type));
    dispatch(setUserSupplierId(user.supplier_id));
    dispatch(setUserEmailAddress(emailAddress));
    dispatch(setUserPassword(password));

    // Mémoriser l'utilisateur dans localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        language: user.language,
        type: user.type,
        supplierId: user.supplier_id,
        emailAddress,
        password,
        token: userToken
      })
    );

    // Mettre à jour axios
    axios.defaults.headers.common["authorization"] = `Bearer ${userToken}`;
    dispatch(setUserToken(userToken));
  };
}

/** ---------------------------
 * editToken
 */
export const editToken = (token: string) => (dispatch: AppDispatch) => {
  dispatch(setUserToken(token));
  axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
};

// ---------------------------
//  ADD USER
function addUserDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add user failed!"));
    } else {
      dispatch(getUsers()); // on relance la liste
    }
  };
}

export const addUser = (
  firstName: string,
  lastName: string,
  emailAddress: string,
  type: string,
  supplierId: number,
  language: string
) => async (dispatch: AppDispatch) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));

  try {
    const res = await axios.post(`/api/users/add/`, {
      firstName,
      lastName,
      emailAddress,
      type,
      supplierId,
      language
    });
    dispatch(addUserDispatch(res));
  } catch (err: any) {
    dispatch(setAddError(String(err)));
  } finally {
    dispatch(setAddPending(false));
  }
};

// ---------------------------
//  EDIT USER
function editUserDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit user failed!"));
    } else {
      dispatch(getUsers());
    }
  };
}

export const editUser = (
  id: number,
  firstName: string,
  lastName: string,
  emailAddress: string,
  type: string,
  supplierId: number,
  language: string,
  resetPassword: boolean
) => async (dispatch: AppDispatch) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  try {
    const res = await axios.put(`/api/users/edit/${id}`, {
      firstName,
      lastName,
      emailAddress,
      type,
      supplierId,
      language,
      resetPassword
    });
    dispatch(editUserDispatch(res));
  } catch (err: any) {
    dispatch(setEditError(String(err)));
  } finally {
    dispatch(setEditPending(false));
  }
};

// ---------------------------
//  DELETE USER
function deleteUserDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete user failed!"));
    } else {
      dispatch(getUsers());
    }
  };
}

export const deleteUser = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));

  try {
    const res = await axios.delete(`/api/users/delete/${id}`);
    dispatch(deleteUserDispatch(res));
  } catch (err: any) {
    dispatch(setDeleteError(String(err)));
  } finally {
    dispatch(setDeletePending(false));
  }
};

// ---------------------------
//  GET USERS
function getUsersDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List users failed!"));
    }
  };
}

export const getUsers = () => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.get(`/api/users/list/`);
    // On met à jour "userList" depuis userSlice
    dispatch(setUserList(response.data));
    // On poursuit la logique existante
    dispatch(getUsersDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

// On ajoute dans le code un thunk "checkUserValidity"
function checkUserValidityDispatch(res: any) {
    return (dispatch: AppDispatch) => {
      if (!res.payload?.data) {
        dispatch(setListError("Check user validity failed!"));
      } else {
        // On met à jour userValidity SI on veut stocker la validité dans le store
        dispatch(setUserValidity(res.payload?.data)); 
      }
    };
  }
  
  export const checkUserValidity = () => async (dispatch: AppDispatch) => {
    dispatch(setListError("")); // On réinitialise l'erreur
    try {
      const response = await axios.get(`/api/users/check_validity/`);
      // On met à jour userValidity dans le store
      dispatch(setUserValidity(response.data));
      // On poursuit la logique existante (par ex : un dispatch additionnel)
      dispatch(checkUserValidityDispatch({ payload: { data: response.data } }));
    } catch (err: any) {
      dispatch(setListError(String(err)));
    }
  };

export const editUserLanguage = (language: string) => (dispatch: AppDispatch) => {
  dispatch(setUserLanguage(language));
  // Mettre à jour le localStorage
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userObj = JSON.parse(storedUser);
    userObj.language = language;
    localStorage.setItem("user", JSON.stringify(userObj));
  }
};
