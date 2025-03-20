// ./thunks/category.ts (ou le même fichier que tu utilisais avant "category.ts")

import axios from "axios";

// Import de la nouvelle action
import { setCategoryList } from "../slices/categorySlice";

// Import des actions "add", "edit", "delete", "list" qu'on a déjà converties en slices
import { setAddPending, setAddSuccess, setAddError } from "../slices/addSlice";
import { setEditPending, setEditSuccess, setEditError } from "../slices/editSlice";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "../slices/deleteSlice";
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

// Authentification
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 *  addCategory
 */
function addCategoryDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add category failed!"));
    } else {
      dispatch(getCategoriesSupplier(supplierId));
    }
  };
}

export const addCategory = (
  title: string,
  titleEn: string,
  order: number,
  supplierId: number
) => async (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));

  try {
    const res = await axios.post(`/api/categories/add/`, {
      title,
      titleEn,
      order,
      supplierId
    });
    dispatch(addCategoryDispatch(res, supplierId));
  } catch (err: any) {
    dispatch(setAddError(String(err)));
  } finally {
    dispatch(setAddPending(false));
  }
};

/** ---------------------------
 *  editCategory
 */
function editCategoryDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit category failed!"));
    } else {
      dispatch(getCategoriesSupplier(supplierId));
    }
  };
}

export const editCategory = (
  id: number,
  title: string,
  titleEn: string,
  order: number,
  supplierId: number
) => async (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  try {
    const res = await axios.put(`/api/categories/edit/${id}`, {
      title,
      titleEn,
      order,
      supplierId
    });
    dispatch(editCategoryDispatch(res, supplierId));
  } catch (err: any) {
    dispatch(setEditError(String(err)));
  } finally {
    dispatch(setEditPending(false));
  }
};

/** ---------------------------
 *  deleteCategory
 */
function deleteCategoryDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete category failed!"));
    } else {
      dispatch(getCategoriesSupplier(supplierId));
    }
  };
}

export const deleteCategory = (id: number, supplierId: number) => async (dispatch: Function) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));

  try {
    const res = await axios.delete(`/api/categories/delete/${id}`);
    dispatch(deleteCategoryDispatch(res, supplierId));
  } catch (err: any) {
    dispatch(setDeleteError(String(err)));
  } finally {
    dispatch(setDeletePending(false));
  }
};

/** ---------------------------
 *  getCategories
 */
function getCategoriesDispatch(responseData: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!responseData));
    if (!responseData) {
      dispatch(setListError("List categories failed!"));
    }
  };
}

export const getCategories = () => async (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    // On récupère la liste
    const response = await axios.get(`/api/categories/list/`);
    
    // 1) Mettre à jour le store via la nouvelle action setCategoryList
    dispatch(setCategoryList(response.data));
    
    // 2) Gérer le success / error pour "list"
    dispatch(getCategoriesDispatch(response.data));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getCategoriesSupplier
 */
function getCategoriesSupplierDispatch(responseData: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!responseData));
    if (!responseData) {
      dispatch(setListError("List categories supplier failed!"));
    }
  };
}

export const getCategoriesSupplier = (supplierId: number) => async (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    // Appel API
    const response = await axios.get(`/api/categories/list_supplier/${supplierId}`);
    
    // On met à jour le store
    dispatch(setCategoryList(response.data));
    dispatch(getCategoriesSupplierDispatch(response.data));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};
