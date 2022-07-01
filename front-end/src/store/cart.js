import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const storedItems = localStorage.getItem('userCart')
  ? JSON.parse(localStorage.getItem('userCart'))
  : [];

const shippingAddressStored = localStorage.getItem('userShippingAddress')
  ? JSON.parse(localStorage.getItem('userShippingAddress'))
  : {};

const initialCartState = {
  cart: storedItems,
  shippingAddress: shippingAddressStored,
  paymentMethod: null,
  loading: 'idle',
  error: null,
};

export const addProductToCart = createAsyncThunk(
  'cart/addProductToCart',
  async ({ productId, quantity }, { getState }) => {
    const { loading } = getState().cart;
    if (loading !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/products/${productId}`
    );

    const resJson = await response.json();

    return {
      productId: resJson.product.id,
      name: resJson.product.name,
      brand: resJson.product.brand,
      price: resJson.product.price,
      image: resJson.product.image,
      quantity,
      stock: resJson.product.stock,
    };
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    removeProductFromCart(state, action) {
      state.cart = state.cart.filter(
        (product) => product.productId !== action.payload
      );
      localStorage.setItem('userCart', JSON.stringify(state.cart));
    },
    storeShippingAddress(state, action) {
      state.shippingAddress = action.payload;

      localStorage.setItem(
        'userShippingAddress',
        JSON.stringify(state.shippingAddress)
      );
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    emptyCart(state) {
      localStorage.removeItem('userCart');
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductToCart.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';

          const existingProduct = state.cart.find(
            (product) => product.productId === action.payload.productId
          );
          if (existingProduct) {
            state.cart = state.cart.map((product) =>
              product.productId === existingProduct.productId
                ? action.payload
                : product
            );
          } else state.cart = [...state.cart, action.payload];

          localStorage.setItem('userCart', JSON.stringify(state.cart));
        }
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      });
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
