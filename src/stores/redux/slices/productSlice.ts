import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProduct,
  getProductByUserId,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/api/product.service";
import type { Product } from "../../../services/types/product";
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProduct();
      return response;
    } catch (error) {
      console.log("Error fetching products: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchProductsByUserId = createAsyncThunk(
  "products/fetchProductsByUserId",
  async (creatorId: number, thunkAPI) => {
    try {
      const response = await getProductByUserId(creatorId);
      return response;
    } catch (error) {
      if ((error as { status: number }).status === 404) return [];
      console.log("Error fetching products: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: Product, thunkAPI) => {
    try {
      const response = await addProduct(product);
      return response;
    } catch (error) {
      console.log("Error creating product: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, product }: { id: number; product: Product }, thunkAPI) => {
    try {
      const response = await updateProduct(id, product);
      return response;
    } catch (error) {
      console.log("Error updating product: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id: number, thunkAPI) => {
    try {
      const response = await deleteProduct(id);
      return response;
    } catch (error) {
      console.log("Error deleting product: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState: { items: Product[]; status: string; error: string | null } =
  {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  };

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      })

      //fetch products by user
      .addCase(fetchProductsByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProductsByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      })

      //create product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create product";
      })

      //edit product
      .addCase(editProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update product";
      })

      //remove product
      .addCase(removeProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (product) => product.id !== action.payload.id
        );
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export default productSlice.reducer;
