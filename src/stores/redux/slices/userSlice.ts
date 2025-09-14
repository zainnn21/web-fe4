import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../../../services/api/auth.service";
import type { User, UserLogin } from "../../../services/types/auth";

//async thunk untuk register
export const registerNewUser = createAsyncThunk(
  "user/registerNewUser",
  async (inputUser: User, thunkAPI) => {
    if (
      !inputUser.name ||
      !inputUser.email ||
      !inputUser.gender ||
      !inputUser.phone ||
      !inputUser.password ||
      !inputUser.countryCode ||
      !inputUser.konfirmasiPassword
    ) {
      return thunkAPI.rejectWithValue("All fields are required");
    }

    if (inputUser.password !== inputUser.konfirmasiPassword) {
      return thunkAPI.rejectWithValue("Passwords do not match");
    }

    if (inputUser.phone.toString().length < 8) {
      return thunkAPI.rejectWithValue("Phone number must be at least 8 digits");
    }

    if (inputUser.phone.toString().length > 15) {
      return thunkAPI.rejectWithValue("Phone number must be at most 15 digits");
    }

    if (isNaN(inputUser.phone)) {
      return thunkAPI.rejectWithValue("Phone number must be numeric");
    }

    try {
      const { ...userDataForAPI } = inputUser;
      const response = await registerUser(userDataForAPI);
      console.log("Data User Berhasil Ditambahkan: ", inputUser);
      return response;
    } catch (error) {
      console.error("Pendaftaran gagal:", error);
      alert("Pendaftaran gagal. Silakan coba lagi.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//async thunk untuk login
export const login = createAsyncThunk(
  "user/login",
  async (data: UserLogin, thunkAPI) => {
    const target = data;

    if (!target.email || !target.password) {
      return thunkAPI.rejectWithValue("All fields are required");
    }

    try {
      const loggedInUser = await loginUser(data);
      const token = "";
      const user = loggedInUser;
      const isLogin = true;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLogin", JSON.stringify(isLogin));
      console.log(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//async thunk untuk fetching data
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (id: string, thunkAPI) => {
    try {
      const response = await getUserById(id);
      return response;
    } catch (error) {
      console.log("Error fetching user: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ id, profile }: { id: string; profile: User }, thunkAPI) => {
    try {
      const response = await updateUser(id, profile);
      return response;
    } catch (error) {
      console.log(error);
      alert("Gagal memperbarui data user");
      return thunkAPI.rejectWithValue({ error: "Gagal memperbarui data user" });
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "user/deleteUserAccount",
  async (id: string, thunkAPI) => {
    try {
      if (!confirm("Apakah anda yakin ingin menghapus akun?")) return;
      console.log(id);
      const response = await deleteUser(id);

      localStorage.removeItem("user");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("token");
      alert("Akun berhasil dihapus");

      if (window.location.pathname === "/my-profile")
        window.location.href = "/";

      return response;
    } catch (error) {
      console.log(error);
      alert("Gagal menghapus data user");
      return thunkAPI.rejectWithValue({ error: "Gagal menghapus data user" });
    }
  }
);

// state awal
const initialState: { items: User[]; error: string; status: string } = {
  items: [],
  error: "",
  status: "idle", // idle | loading | succeeded | failed
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reducer untuk menangani perubahan pada setiap field di form profil
    setProfileField: <K extends keyof User>(
      state: { items: User[] },
      action: { payload: { field: K; value: User[K] } }
    ) => {
      if (state.items.length > 0) {
        state.items[0][action.payload.field] = action.payload.value;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      //fetch user
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.log("Payload: ", action.payload);
        state.status = "succeeded";
        state.items = [action.payload];
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user";
      })

      //register user
      .addCase(registerNewUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [action.payload];
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to register user";
      })

      //update user
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [action.payload];
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update user";
      })

      //delete user
      .addCase(deleteUserAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.status = "succeeded";
        state.items = [];
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete user";
      })

      //login user
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [action.payload];
        state.error = "";
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as Error).message || "Login failed";
      });
  },
});

export const { setProfileField } = userSlice.actions;

export default userSlice.reducer;
