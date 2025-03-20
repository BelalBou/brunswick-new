import { configureStore } from "@reduxjs/toolkit";
// import de ton slice
import allergyReducer from "./slices/allergySlice";
// idem pour add, edit, delete, list
import addReducer from "./slices/addSlice";
import editReducer from "./slices/editSlice";
import deleteReducer from "./slices/deleteSlice";
import listReducer from "./slices/listSlice";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import dailyMailReducer from "./slices/dailyMailSlice";
import dictionnaryReducer from "./slices/dictionnarySlice";
import extraReducer from "./slices/extraSlice";
import loginReducer from "./slices/loginSlice";
import pageReducer from "./slices/pageSlice";    
import userReducer from "./slices/userSlice";
import menuReducer from "./slices/menuSlice";
import menuSizeReducer from "./slices/menuSizeSlice";
import orderReducer from "./slices/orderSlice";
import serverTimeReducer from "./slices/serverTimeSlice";
import settingReducer from "./slices/settingSlice";

const store = configureStore({
  reducer: {
    allergy: allergyReducer,  
    add: addReducer,
    edit: editReducer,
    delete: deleteReducer,
    list: listReducer,
    cart: cartReducer,
    category: categoryReducer,
    dailyMail: dailyMailReducer,
    dictionnary: dictionnaryReducer,
    extra: extraReducer,
    login: loginReducer,
    user: userReducer,
    page: pageReducer,
    menu: menuReducer,
    menuSize: menuSizeReducer,
    order: orderReducer,
    serverTime: serverTimeReducer,
    setting: settingReducer,
  }
});

// Export du type du dispatch si besoin
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
