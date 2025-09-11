import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  getUserById,
  registerUser,
} from "../../../services/api/auth.service";
import { useNavigate } from "react-router-dom";

//async thunk untuk register
export const registerNewUser = createAsyncThunk("user/registerNewUser", async (event: React.FormEvent<HTMLFormElement>, thunkAPI) => {
    const navigate = useNavigate();
    event.preventDefault();
    const target = event.currentTarget;
    
    const inputUser = {
      id: Math.random().toString(36), // generate a random id
      name: target.namalenkap.value,
      email: target.email.value,
      gender: target.gender.value,
      phone: target.phone.value,
      password: target.password.value,
      konfirmasiPassword: target.konfirmasipassword.value,
      countryCode: target.countryCode.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (
      !inputUser.name ||
      !inputUser.email ||
      !inputUser.gender ||
      !inputUser.phone ||
      !inputUser.password ||
      !inputUser.konfirmasiPassword ||
      !inputUser.countryCode
    ) {
        return thunkAPI.rejectWithValue('All fields are required');
    }

    if (inputUser.password !== inputUser.konfirmasiPassword) {
      return thunkAPI.rejectWithValue('Passwords do not match');
    }

    if (inputUser.phone.length < 8) {
        return thunkAPI.rejectWithValue('Phone number must be at least 8 digits');
    }

    if (inputUser.phone.length > 15) {
        return thunkAPI.rejectWithValue('Phone number must be at most 15 digits');
    }

    if (!inputUser.phone.match(/^\d+$/)) {
      return thunkAPI.rejectWithValue('Phone number must be numeric');
    }

    try {
      const response = await registerUser(inputUser);
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      console.log("Data User Berhasil Ditambahkan: ", inputUser);
      alert("Pendaftaran berhasil!");
      navigate("/login");
      return data;
    } catch (error) {
      console.error("Pendaftaran gagal:", error);
      alert("Pendaftaran gagal. Silakan coba lagi.");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//async thunk untuk fetching data
export const fetchUser = createAsyncThunk("user/fetchUser", async (id: string) => {
  try {
    const response = await getUserById(id);
    return response;
  } catch (error) {
    console.log("Error fetching user: ", error);
    throw error;
  }
});

// state awal
const initialState = {
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
      });
  },
});

export default userSlice.reducer;