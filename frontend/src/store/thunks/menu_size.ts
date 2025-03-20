// ./thunks/menuSizeThunks.ts

import axios from "axios";
import { AppDispatch } from "../store";

// Import de la nouvelle action setMenuSizeList
import { setMenuSizeList } from "../slices/menuSizeSlice";

// Import des actions "pending/success/error" depuis leurs slices
import { setAddPending, setAddSuccess, setAddError } from "../slices/addSlice";
import { setEditPending, setEditSuccess, setEditError } from "../slices/editSlice";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "../slices/deleteSlice";
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

// Authentification
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 *  addMenuSize
 */
function addMenuSizeDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add menu size failed!"));
    } else {
      dispatch(getMenuSizes());
    }
  };
}

export const addMenuSize = (title: string, titleEn: string) => async (dispatch: AppDispatch) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));

  try {
    const res = await axios.post(`/api/menu_sizes/add/`, {
      title,
      titleEn
    });
    dispatch(addMenuSizeDispatch(res));
  } catch (err: any) {
    dispatch(setAddError(String(err)));
  } finally {
    dispatch(setAddPending(false));
  }
};

/** ---------------------------
 *  editMenuSize
 */
function editMenuSizeDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit menu size failed!"));
    } else {
      dispatch(getMenuSizes());
    }
  };
}

export const editMenuSize = (id: number, title: string, titleEn: string) => async (dispatch: AppDispatch) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  try {
    const res = await axios.put(`/api/menu_sizes/edit/${id}`, {
      title, // on corrige le paramètre qui manquait
      titleEn
    });
    dispatch(editMenuSizeDispatch(res));
  } catch (err: any) {
    dispatch(setEditError(String(err)));
  } finally {
    dispatch(setEditPending(false));
  }
};

/** ---------------------------
 *  deleteMenuSize
 */
function deleteMenuSizeDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete menu size failed!"));
    } else {
      dispatch(getMenuSizes());
    }
  };
}

export const deleteMenuSize = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));

  try {
    const res = await axios.delete(`/api/menu_sizes/delete/${id}`);
    dispatch(deleteMenuSizeDispatch(res));
  } catch (err: any) {
    dispatch(setDeleteError(String(err)));
  } finally {
    dispatch(setDeletePending(false));
  }
};

/** ---------------------------
 *  getMenuSizes
 */
function getMenuSizesDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List menu sizes failed!"));
    }
  };
}

export const getMenuSizes = () => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.get(`/api/menu_sizes/list/`);
    // Mise à jour du store avec la nouvelle action setMenuSizeList
    dispatch(setMenuSizeList(response.data));

    // On poursuit la logique existante
    dispatch(getMenuSizesDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};
