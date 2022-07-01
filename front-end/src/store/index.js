import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth';
import userReducer from './user';
import productReducer from './product';
import cartReducer from './cart';
import orderReducer from './order';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;
