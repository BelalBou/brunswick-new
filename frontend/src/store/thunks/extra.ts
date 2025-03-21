// ./thunks/extra.ts (ou le même fichier "extra.ts")

import axios from "axios";
// On importe désormais l'action du slice
import { setExtraList } from "../slices/extraSlice";

// On importe les slices pour "add", "edit", "delete", "list"
import { setAddPending, setAddSuccess, setAddError } from "../slices/addSlice";
import { setEditPending, setEditSuccess, setEditError } from "../slices/editSlice";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "../slices/deleteSlice";
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

// Authentification
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 * addExtra
 */
function addExtraDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add extra failed!"));
    } else {
      dispatch(getExtrasSupplier(supplierId));
    }
  };
}

export const addExtra = (
  title: string,
  titleEn: string,
  pricing: number,
  supplierId: number,
  menuSizeId: number
) => async (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));

  try {
    const res = await axios.post(`/api/extras/add/`, {
      title,
      titleEn,
      pricing,
      supplierId,
      menuSizeId
    });
    dispatch(addExtraDispatch(res, supplierId));
  } catch (err: any) {
    dispatch(setAddError(String(err)));
  } finally {
    dispatch(setAddPending(false));
  }
};

/** ---------------------------
 * editExtra
 */
function editExtraDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit extra failed!"));
    } else {
      dispatch(getExtrasSupplier(supplierId));
    }
  };
}

export const editExtra = (
  id: number,
  title: string,
  titleEn: string,
  pricing: number,
  supplierId: number,
  menuSizeId: number
) => async (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  try {
    const res = await axios.put(`/api/extras/edit/${id}`, {
      title,
      titleEn,
      pricing,
      supplierId,
      menuSizeId
    });
    dispatch(editExtraDispatch(res, supplierId));
  } catch (err: any) {
    dispatch(setEditError(String(err)));
  } finally {
    dispatch(setEditPending(false));
  }
};

/** ---------------------------
 * deleteExtra
 */
function deleteExtraDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete extra failed!"));
    } else {
      dispatch(getExtrasSupplier(supplierId));
    }
  };
}

export const deleteExtra = (id: number, supplierId: number) => async (dispatch: Function) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));

  try {
    const res = await axios.delete(`/api/extras/delete/${id}`);
    dispatch(deleteExtraDispatch(res, supplierId));
  } catch (err: any) {
    dispatch(setDeleteError(String(err)));
  } finally {
    dispatch(setDeletePending(false));
  }
};

/** ---------------------------
 * getExtrasSupplier
 */
function getExtrasSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List extras supplier failed!"));
    }
  };
}

export const getExtrasSupplier = (supplierId: number) => async (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.get(`/api/extras/list_supplier/${supplierId}`);
    dispatch(setExtraList(response.data));
    dispatch(getExtrasSupplierDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};
