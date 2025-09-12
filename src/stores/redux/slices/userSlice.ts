import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
} from "../../../services/api/auth.service";
import type { User } from "../../../services/types/auth";

//async thunk untuk register
export const registerNewUser = createAsyncThunk(
  "user/registerNewUser",
  async (inputUser : User, thunkAPI) => {
    if (
      !inputUser.name ||
      !inputUser.email ||
      !inputUser.gender ||
      !inputUser.phone ||
      !inputUser.password ||
      !inputUser.countryCode
      || !inputUser.konfirmasiPassword
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

//async thunk untuk fetching data
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (id: string, thunkAPI) => {
    try {
      const response = await getUserById(id);
      if (!response.ok) throw new Error("Failed to fetch user");
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching user: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const setProfileField = createAsyncThunk(
  "user/setProfileField",
  async ({ field, value }: { field: string; value: string }) => {
    return { field, value };
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (id: string, thunkAPI) => {
    try {
      const profile = await getUserById(id);
      const response = await updateUser(id, profile);
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(response));
      alert("Data berhasil diubah");
      return data;
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
      if (!response.ok) throw new Error("Failed to delete user");
      const data = await response.json();

      localStorage.removeItem("user");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("token");
      alert("Akun berhasil dihapus");

      if (window.location.pathname === "/my-profile")
        window.location.href = "/";

      return data;
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch user
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
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
        state.items = action.payload;
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
        state.items = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update user";
      })

      //delete user
      .addCase(deleteUserAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export default userSlice.reducer;
