// ./thunks/daily_mail.ts (ou le même fichier "daily_mail.ts")

import axios from "axios";
import { setDailyMailList } from "../slices/dailyMailSlice"; // <-- On importe la nouvelle action
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

// Authentification
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 *  getDailyMails
 */
export const getDailyMails = () => async (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.get(`/api/daily_mails/list/`);
    
    // 1) On met à jour notre store (nouveau slice)
    dispatch(setDailyMailList(response.data));

    // 2) On gère le success (ex: setListSuccess(true))
    dispatch(setListSuccess(true));
  } catch (err: any) {
    dispatch(setListError("List daily mails failed!"));
  } finally {
    dispatch(setListPending(false));
  }
};
