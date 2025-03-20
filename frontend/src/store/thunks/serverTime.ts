// ./thunks/serverTimeThunks.ts

import axios from "axios";
import { AppDispatch } from "../store";

// On importe la nouvelle action depuis le slice
import { setServerTime } from "../slices/serverTimeSlice";
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/**
 * Récupère le "server time" depuis /api/orders/check_time/
 */
export const getServerTime = () => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.get(`/api/orders/check_time/`);
    // On met à jour serverTimeList
    dispatch(setServerTime(response.data));
    dispatch(setListSuccess(true));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};
