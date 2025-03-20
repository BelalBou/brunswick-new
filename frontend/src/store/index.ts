import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import des reducers
import userReducer from './slices/userSlice';
import menuReducer from './slices/menuSlice';
import categoryReducer from './slices/categorySlice';
import supplierReducer from './slices/supplierSlice';
import orderReducer from './slices/orderSlice';
import allergyReducer from './slices/allergySlice';
import extraReducer from './slices/extraSlice';
import menuSizeReducer from './slices/menuSizeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    category: categoryReducer,
    supplier: supplierReducer,
    order: orderReducer,
    allergy: allergyReducer,
    extra: extraReducer,
    menuSize: menuSizeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore ces actions pour la vérification de sérialisation
        ignoredActions: ['user/login/fulfilled', 'user/register/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks typés
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 