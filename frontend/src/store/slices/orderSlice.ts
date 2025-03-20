// ./slices/orderSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IOrder from "../../interfaces/IOrder";
import IOrderExtra from "../../interfaces/IOrderExtra";

interface OrderState {
  orderList: IOrder[];
  orderExtraList: IOrderExtra[];
  orderListTotalCount: number;
}

const initialState: OrderState = {
  orderList: [],
  orderExtraList: [],
  orderListTotalCount: 0
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderList(state, action: PayloadAction<IOrder[]>) {
      // Equivalent de "SET_ORDER_LIST" 
      state.orderList = action.payload;
    },
    setOrderListSpread(state, action: PayloadAction<IOrder[]>) {
      // Equivalent de "SET_ORDER_LIST_SPREAD"
      state.orderList = [...state.orderList, ...action.payload];
    },
    setOrderExtraList(state, action: PayloadAction<IOrderExtra[]>) {
      // Equivalent de "SET_ORDER_EXTRA_LIST"
      state.orderExtraList = action.payload;
    },
    setOrderListTotalCount(state, action: PayloadAction<number>) {
      // Equivalent de "SET_ORDER_LIST_TOTAL_COUNT"
      state.orderListTotalCount = action.payload;
    }
  }
});

export const {
  setOrderList,
  setOrderListSpread,
  setOrderExtraList,
  setOrderListTotalCount
} = orderSlice.actions;

export default orderSlice.reducer;
