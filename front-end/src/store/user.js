import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialUserState = {
  user: null,
  userEdit: null,
  loading: 'idle',
  loadingUsers: 'idle',
  loadingDelete: 'idle',
  loadingUserEdit: 'idle',
  error: null,
  getSuccess: false,
  updateProfileSuccess: false,
  updateUserSuccess: false,
  userDeleteSuccess: false,
  users: [],
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async (uid, { getState }) => {
    const { loading } = getState().user;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/${uid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resJson = await response.json();
    return resJson;
  }
);

export const getUserForAdmin = createAsyncThunk(
  'user/getUserForAdmin',
  async (uid, { getState }) => {
    const { loadingUserEdit } = getState().user;
    const { token } = getState().auth;

    if (loadingUserEdit !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/${uid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resJson = await response.json();
    return resJson.user;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (user, { getState }) => {
    const { loading } = getState().user;
    const { token } = getState().auth;

    if (loading !== 'pending') return;

    await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${user.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      }
    );
  }
);

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (userId = 0, { getState }) => {
    const { loadingUsers } = getState().user;
    const { token } = getState().auth;

    if (loadingUsers !== 'pending') return;

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + '/api/users',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resJson = await response.json();
    return resJson.users;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { getState }) => {
    const { loadingDelete } = getState().user;
    const { token } = getState().auth;

    if (loadingDelete !== 'pending') return;

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user, { getState }) => {
    const { loadingUserEdit } = getState().user;
    const { token } = getState().auth;

    if (loadingUserEdit !== 'pending') return;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      }
    );
    const resJson = await response.json();
    return resJson;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    resetUpdateProfileSuccess(state) {
      state.updateProfileSuccess = false;
    },
    resetGetSuccess(state) {
      state.getSuccess = false;
    },
    resetDeleteSuccess(state) {
      state.userDeleteSuccess = false;
    },
    resetUser(state) {
      state.user = null;
    },
    resetUpdateUserSuccess(state) {
      state.updateUserSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(getUser.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.user = action.payload.user;
          state.getSuccess = true;
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(updateUserProfile.pending, (state) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
        }
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.updateProfileSuccess = true;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle';
          state.error = action.error;
        }
      })
      .addCase(getUsers.pending, (state) => {
        if (state.loadingUsers === 'idle') {
          state.loadingUsers = 'pending';
        }
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        if (state.loadingUsers === 'pending') {
          state.loadingUsers = 'idle';
          state.users = action.payload;
        }
      })
      .addCase(getUsers.rejected, (state, action) => {
        if (state.loadingUsers === 'pending') {
          state.loadingUsers = 'idle';
          state.error = action.error;
        }
      })
      .addCase(deleteUser.pending, (state) => {
        if (state.loadingDelete === 'idle') {
          state.loadingDelete = 'pending';
        }
      })
      .addCase(deleteUser.fulfilled, (state) => {
        if (state.loadingDelete === 'pending') {
          state.loadingDelete = 'idle';
          state.userDeleteSuccess = true;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        if (state.loadingDelete === 'pending') {
          state.loadingDelete = 'idle';
          state.error = action.error;
        }
      })
      .addCase(getUserForAdmin.pending, (state) => {
        if (state.loadingUserEdit === 'idle') {
          state.loadingUserEdit = 'pending';
        }
      })
      .addCase(getUserForAdmin.fulfilled, (state, action) => {
        if (state.loadingUserEdit === 'pending') {
          state.loadingUserEdit = 'idle';
          state.userEdit = action.payload;
        }
      })
      .addCase(getUserForAdmin.rejected, (state, action) => {
        if (state.loadingUserEdit === 'pending') {
          state.loadingUserEdit = 'idle';
          state.error = action.error;
        }
      })
      .addCase(updateUser.pending, (state) => {
        if (state.loadingUserEdit === 'idle') {
          state.loadingUserEdit = 'pending';
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.loadingUserEdit === 'pending') {
          state.loadingUserEdit = 'idle';
          state.userEdit = action.payload;
          state.updateUserSuccess = true;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        if (state.loadingUserEdit === 'pending') {
          state.loadingUserEdit = 'idle';
          state.error = action.error;
        }
      });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
