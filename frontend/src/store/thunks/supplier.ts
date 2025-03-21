// ./store/thunks/supplierThunks.ts
import axios from "axios";
import { AppDispatch } from "../store";
import { setSupplierList } from "../slices/supplierSlice";

export const getSuppliers = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get("/api/suppliers/public");
    dispatch(setSupplierList(response.data));
  } catch (error: any) {
    console.error("Error fetching suppliers:", error);
    // Vous pouvez gérer une action d'erreur ici si nécessaire.
  }
};
