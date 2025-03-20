// ./thunks/dictionnary.ts (ou le même fichier "dictionnary.ts")
import axios from "axios";
import { setDictionnaryList } from "../slices/dictionnarySlice"; // nouvelle action
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/**
 * Récupère la liste de dictionnaires
 */
export const getDictionnaries = () => async (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.get(`/api/dictionnaries/list/`);
    // 1) On met à jour l'état dictionnaryList
    dispatch(setDictionnaryList(response.data));
    // 2) Succès pour "list"
    dispatch(setListSuccess(true));
  } catch (err) {
    dispatch(setListError("List dictionnaries failed!"));
  } finally {
    dispatch(setListPending(false));
  }
};
