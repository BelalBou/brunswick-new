// ./thunks/menuThunks.ts

import axios from "axios";
import async from "async";

// Import de la nouvelle action setMenuList
import { setMenuList } from "../slices/menuSlice";

// Import des actions "pending/success/error" depuis leurs slices
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";
import { setAddPending, setAddSuccess, setAddError } from "../slices/addSlice";
import { setEditPending, setEditSuccess, setEditError } from "../slices/editSlice";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "../slices/deleteSlice";

// Authentification
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 *  addMenu
 */
function addMenuDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add menu failed!"));
    } else {
      dispatch(getMenusSupplier(supplierId));
    }
  };
}

export const addMenu = (
  title: string,
  titleEn: string,
  sizeId: number,
  pricing: number,
  description: string,
  descriptionEn: string,
  categoryId: number,
  allergyIds: number[],
  extraIds: number[],
  picture: File,
  addPicture: boolean,
  supplierId: number
) => (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));

  async.waterfall(
    [
      // 1) Appel à /api/menus/add/
      (callback: any) => {
        axios
          .post(`/api/menus/add/`, {
            title,
            titleEn,
            sizeId,
            pricing,
            description,
            descriptionEn,
            categoryId,
            allergyIds,
            extraIds,
            supplierId,
            picture: picture && addPicture ? picture.name : null
          })
          .then((res) => callback(null, res))
          .catch((error) => callback(error, null));
      },
      // 2) Envoi de l'image si addPicture == true
      (result: any, callback: any) => {
        if (result && picture && addPicture) {
          const data = new FormData();
          data.append("picture", picture);
          axios.post("/api/menus/add_picture/", data).catch((err) => {
            // Selon votre logique, vous pouvez gérer l'erreur ici
            console.error("Error uploading picture", err);
          });
        }
        callback(null, result);
      },
      // 3) Dispatch final
      (result: any, callback: any) => {
        dispatch(addMenuDispatch(result, supplierId));
        callback(null, "");
      }
    ],
    (err: any) => {
      if (err) dispatch(setAddError(err.message));
      dispatch(setAddPending(false));
    }
  );
};

/** ---------------------------
 *  editMenu
 */
function editMenuDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit menu failed!"));
    } else {
      dispatch(getMenusSupplier(supplierId));
    }
  };
}

export const editMenu = (
  id: number,
  title: string,
  titleEn: string,
  sizeId: number,
  pricing: number,
  description: string,
  descriptionEn: string,
  categoryId: number,
  allergyIds: number[],
  extraIds: number[],
  picture: File,
  editPicture: boolean,
  supplierId: number
) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  async.waterfall(
    [
      (callback: any) => {
        axios
          .put(`/api/menus/edit/${id}`, {
            title,
            titleEn,
            sizeId,
            pricing,
            description,
            descriptionEn,
            categoryId,
            allergyIds,
            extraIds,
            supplierId,
            picture: picture && editPicture ? picture.name : null
          })
          .then((res) => callback(null, res))
          .catch((error) => callback(error, null));
      },
      (result: any, callback: any) => {
        if (result && picture && editPicture) {
          const data = new FormData();
          data.append("picture", picture);
          axios.post("/api/menus/add_picture/", data).catch((err) => {
            console.error("Error uploading picture", err);
          });
        }
        callback(null, result);
      },
      (result: any, callback: any) => {
        dispatch(editMenuDispatch(result, supplierId));
        callback(null, "");
      }
    ],
    (err: any) => {
      if (err) dispatch(setEditError(err.message));
      dispatch(setEditPending(false));
    }
  );
};

/** ---------------------------
 *  deleteMenu
 */
function deleteMenuDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete menu failed!"));
    } else {
      dispatch(getMenusSupplier(supplierId));
    }
  };
}

export const deleteMenu = (id: number, supplierId: number) => async (dispatch: Function) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));

  try {
    const res = await axios.delete(`/api/menus/delete/${id}`);
    dispatch(deleteMenuDispatch(res, supplierId));
  } catch (err: any) {
    dispatch(setDeleteError(String(err)));
  } finally {
    dispatch(setDeletePending(false));
  }
};

/** ---------------------------
 *  getMenusSupplier
 */
function getMenusSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List menus for supplier failed!"));
    }
  };
}

export const getMenusSupplier = (id: number) => async (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    // On lance la requête
    const response = await axios.get(`/api/menus/list_supplier/${id}`);
    
    // Màj store
    dispatch(setMenuList(response.data));
    
    // On appelle la suite
    dispatch(getMenusSupplierDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getMenus
 */
function getMenusDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List menus failed!"));
    }
  };
}

export const getMenus = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  const menuList = axios.get("/api/menus/list/");
  
  dispatch(
    menuList.then((response) => {
      dispatch(setMenuList(response.data));
      return { payload: { data: response.data } };
    })
  )
    .then((res: any) => dispatch(getMenusDispatch(res)))
    .catch((err: any) => dispatch(setListError(String(err))))
    .finally(() => {
      dispatch(setListPending(false));
    });
};
