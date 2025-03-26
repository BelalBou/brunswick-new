// ./thunks/settingThunks.ts

import axios from "axios";
import { AppDispatch } from "../store";
import ISetting from "../../interfaces/ISetting";

// Import de la nouvelle action
import { setSettingList } from "../slices/settingSlice";

// Import des actions "edit", "list" (pending/success/error)
import { setEditPending, setEditSuccess, setEditError } from "../slices/editSlice";
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 * editSetting
 */
function editSettingDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit setting failed!"));
    } else {
      dispatch(getSettings());
    }
  };
}

export const editSetting = (
  id: number,
  timeLimit: string,
  startPeriod: string,
  endPeriod: string,
  emailOrderCc: string,
  emailSupplierCc: string,
  emailVendorCc: string
) => async (dispatch: AppDispatch) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  try {
    const res = await axios.put(`/api/settings/${id}`, {
      start_period: parseInt(startPeriod),
      end_period: parseInt(endPeriod),
      email_order_cc: emailOrderCc,
      email_supplier_cc: emailSupplierCc,
      email_vendor_cc: emailVendorCc
    });
    dispatch(editSettingDispatch(res));
  } catch (err: any) {
    dispatch(setEditError(String(err)));
  } finally {
    dispatch(setEditPending(false));
  }
};

/** ---------------------------
 * getSettings
 */
function getSettingsDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List settings failed!"));
    }
  };
}

export const getSettings = () => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    // On récupère la liste
    const response = await axios.get(`/api/settings/list/`);
    // On met à jour le store avec setSettingList
    dispatch(setSettingList(response.data as ISetting[]));

    // On poursuit la logique existante
    dispatch(getSettingsDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};
