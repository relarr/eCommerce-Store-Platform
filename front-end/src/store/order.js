import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialOrderState = {
  newOrder: {},
  order: null,
  loading: 'idle',
  orderPayLoading: 'idle',
  error: null,
  orderCreateSuccess: false,
  orderPaySuccess: false,
  orderIsDeliveredSuccess: false,
  userOrders: [],
  allOrders: [],
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order, { getState }) => {
    const { loading } = getState().order;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + '/api/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      }
    );

    const resJson = await response.json();

    return resJson;
  }
);

export const getOrder = createAsyncThunk(
  'order/getOrder',
  async (orderId, { getState }) => {
    const { loading } = getState().order;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resJson = await response.json();
    return resJson;
  }
);

export const payOrder = createAsyncThunk(
  'order/payOrder',
  async ({ orderId, paymentResult }, { getState }) => {
    const { orderPayLoading } = getState().order;
    const { token } = getState().auth;

    if (orderPayLoading !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}/pay`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentResult),
      }
    );

    const resJson = await response.json();

    return resJson;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (userId = 0, { getState }) => {
    const { loading } = getState().order;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + '/api/orders/userorders',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resJson = await response.json();
    return resJson;
  }
);

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (userId = null, { getState }) => {
    const { loading } = getState().order;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + '/api/orders',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resJson = await response.json();
    return resJson;
  }
);

export const orderIsDelivered = createAsyncThunk(
  'order/orderIsDelivered',
  async (order, { getState }) => {
    const { loading } = getState().order;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/orders/${order._id}/delivered`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resJson = await response.json();

    return resJson;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrderState,
  reducers: {
    resetOrderPaySuccess(state) {
      state.orderPaySuccess = false;
    },
    resetOrderCreateSuccess(state) {
      state.orderCreateSuccess = false;
    },
    resetOrderIsDeliveredSuccess(state) {
      state.orderIsDeliveredSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.newOrder = action.payload;
          state.orderCreateSuccess = true;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(getOrder.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.order = action.payload;
        }
      })
      .addCase(getOrder.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(payOrder.pending, (state) => {
        if (state.orderPayLoading === 'idle') {
          state.orderPayLoading = 'pending';
        }
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        if (state.orderPayLoading === 'pending') {
          state.orderPayLoading = 'idle';
          state.order = action.payload;
          state.orderPaySuccess = true;
        }
      })
      .addCase(payOrder.rejected, (state, action) => {
        if (state.orderPayLoading === 'pending') {
          state.orderPayLoading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(fetchUserOrders.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.userOrders = action.payload;
        }
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(fetchAllOrders.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.allOrders = action.payload;
        }
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(orderIsDelivered.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(orderIsDelivered.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.order = action.payload;
          state.orderIsDeliveredSuccess = true;
        }
      })
      .addCase(orderIsDelivered.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      });
  },
});

export const orderActions = orderSlice.actions;
export default orderSlice.reducer;
