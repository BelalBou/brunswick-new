// ./thunks/allergy.ts (ou le même fichier que tu utilisais avant)

import axios from "axios";

// On importe la nouvelle action depuis le slice
import { setAllergyList } from "../slices/allergySlice";

// On importe toujours les actions des autres slices "add", "edit", etc.
import { setAddPending, setAddSuccess, setAddError } from "../slices/addSlice";
import { setEditPending, setEditSuccess, setEditError } from "../slices/editSlice";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "../slices/deleteSlice";
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

// Paramétrer l'authorization pour Axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 *  addAllergy
 */
function addAllergyDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add allergy failed!"));
    } else {
      // On relance la liste
      dispatch(getAllergies());
    }
  };
}

export const addAllergy = (description: string, descriptionEn: string) => async (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));

  try {
    const res = await axios.post(`/api/allergies/add/`, { description, descriptionEn });
    dispatch(addAllergyDispatch(res));
  } catch (err: any) {
    dispatch(setAddError(String(err)));
  } finally {
    dispatch(setAddPending(false));
  }
};

/** ---------------------------
 *  editAllergy
 */
function editAllergyDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit allergy failed!"));
    } else {
      dispatch(getAllergies());
    }
  };
}

export const editAllergy = (id: number, description: string, descriptionEn: string) => async (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  try {
    const res = await axios.put(`/api/allergies/edit/${id}`, { description, descriptionEn });
    dispatch(editAllergyDispatch(res));
  } catch (err: any) {
    dispatch(setEditError(String(err)));
  } finally {
    dispatch(setEditPending(false));
  }
};

/** ---------------------------
 *  deleteAllergy
 */
function deleteAllergyDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete allergy failed!"));
    } else {
      dispatch(getAllergies());
    }
  };
}

export const deleteAllergy = (id: number) => async (dispatch: Function) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));

  try {
    const res = await axios.delete(`/api/allergies/delete/${id}`);
    dispatch(deleteAllergyDispatch(res));
  } catch (err: any) {
    dispatch(setDeleteError(String(err)));
  } finally {
    dispatch(setDeletePending(false));
  }
};

/** ---------------------------
 *  getAllergies
 */
function getAllergiesDispatch(responseData: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!responseData));
    if (!responseData) {
      dispatch(setListError("List allergies failed!"));
    }
  };
}

export const getAllergies = () => async (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    // On récupère la liste
    const response = await axios.get(`/api/allergies/list/`);
    // 1) On met à jour le store via setAllergyList (notre nouveau slice)
    dispatch(setAllergyList(response.data));  
    // 2) On gère "list" success / error
    dispatch(getAllergiesDispatch(response.data));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};
