import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialProductState = {
  product: null,
  loading: 'idle',
  loadingDelete: 'idle',
  loadingReview: 'idle',
  error: null,
  errorDelete: null,
  errorReview: null,
  productCreateSuccess: false,
  productDeleteSuccess: false,
  productUpdateSuccess: false,
  reviewCreateSuccess: false,
  products: null,
  pages: null,
  page: null,
};

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (product, { getState }) => {
    const { loading } = getState().product;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    const formData = new FormData();
    formData.append('user', product.user);
    formData.append('name', product.name);
    formData.append('brand', product.brand);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('stock', product.stock);
    formData.append('image', product.image);
    formData.append('description', product.description);

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + '/api/products',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const resJson = await response.json();
    if (response.status > 299) throw new Error(resJson.message);
  }
);

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ keyword = '', page = '' }, { getState }) => {
    const { loading } = getState().product;
    if (loading !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/products?keyword=${keyword}&pageNum=${page}`
    );
    const resJson = await response.json();
    return resJson;
  }
);

export const getSingleProduct = createAsyncThunk(
  'product/getSingleProduct',
  async (productId, { getState }) => {
    const { loading } = getState().product;
    if (loading !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/products/${productId}`
    );
    const resJson = await response.json();

    return resJson.product;
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId, { getState }) => {
    const { loadingDelete } = getState().product;
    const { token } = getState().auth;

    if (loadingDelete !== 'pending') return;

    await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/products/${productId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (product, { getState }) => {
    const { loading } = getState().product;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('brand', product.brand);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('stock', product.stock);
    formData.append('image', product.image);
    formData.append('description', product.description);

    await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/products/${product.productId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
  }
);

export const createReview = createAsyncThunk(
  'product/createReview',
  async ({ productId, review }, { getState, rejectWithValue }) => {
    const { loadingReview } = getState().product;
    const { token } = getState().auth;

    if (loadingReview !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/products/${productId}/reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(review),
      }
    );

    const resJson = await response.json();
    if (response.status === 400) throw new Error(resJson.message);
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: initialProductState,
  reducers: {
    resetCreateSuccess(state) {
      state.productCreateSuccess = false;
    },
    resetDeleteSuccess(state) {
      state.productDeleteSuccess = false;
    },
    resetUpdateSuccess(state) {
      state.productUpdateSuccess = false;
    },
    resetErrorReview(state) {
      state.errorReview = null;
    },
    resetReviewSuccess(state) {
      state.reviewCreateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(createProduct.fulfilled, (state) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.productCreateSuccess = true;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(fetchProducts.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.products = action.payload.products;
          state.pages = action.payload.pages;
          state.page = action.payload.page;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(getSingleProduct.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.product = action.payload;
        }
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(deleteProduct.pending, (state) => {
        if (state.loadingDelete === 'idle') {
          state.loadingDelete = 'pending';
        }
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        if (state.loadingDelete === 'pending') {
          state.loadingDelete = 'idle';
          state.productDeleteSuccess = true;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        if (state.loadingDelete === 'pending') {
          state.loadingDelete = 'idle';
          state.errorDelete = action.error;
        }
      })
      .addCase(updateProduct.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(updateProduct.fulfilled, (state) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.productUpdateSuccess = true;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(createReview.pending, (state) => {
        if (state.loadingReview === 'idle') {
          state.loadingReview = 'pending';
        }
      })
      .addCase(createReview.fulfilled, (state) => {
        if (state.loadingReview === 'pending') {
          state.loadingReview = 'idle';
          state.reviewCreateSuccess = true;
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        if (state.loadingReview === 'pending') {
          state.loadingReview = 'idle';
          state.errorReview = action.error;
        }
      });
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
