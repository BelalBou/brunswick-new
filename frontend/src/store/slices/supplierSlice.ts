// ./store/slices/supplierSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ISupplier from "../../interfaces/ISupplier";

interface SupplierState {
  supplierList: ISupplier[];
}

const initialState: SupplierState = {
  supplierList: [],
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setSupplierList(state, action: PayloadAction<ISupplier[]>) {
      state.supplierList = action.payload;
    },
  },
});

export const { setSupplierList } = supplierSlice.actions;
export default supplierSlice.reducer;
