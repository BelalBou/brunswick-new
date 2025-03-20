// ./store/thunks/supplierThunks.ts
import axios from "axios";
import { AppDispatch } from "../store";
import { setSupplierList } from "../slices/supplierSlice";

export const getSuppliers = () => async (dispatch: AppDispatch) => {
  try {
    // On suppose que l'API renvoie la liste des fournisseurs directement dans response.data
    const response = await axios.get("/api/suppliers/list/");
    dispatch(setSupplierList(response.data));
  } catch (error: any) {
    console.error("Error fetching suppliers:", error);
    // Vous pouvez gérer une action d'erreur ici si nécessaire.
  }
};
