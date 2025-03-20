// ./thunks/pageThunks.ts (si jamais tu fais un truc asynchrone)
import { setSelected } from "../slices/pageSlice";

export const changePage = (page: number) => (dispatch: Function) => {
  // éventuelle logique
  dispatch(setSelected(page));
};
