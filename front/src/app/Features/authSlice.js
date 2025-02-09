import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import request from "../../utils/request"
import { createStandaloneToast } from "@chakra-ui/toast"
import CookieService from "../../Services/CookieService"

const initialState = {
    loading: false,
    data: null,
    error: null,
}

const { toast } = createStandaloneToast();

export const userLogin = createAsyncThunk("auth/userLogin", async (credentials, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
        const { data } = await request.post("/auth/local", credentials);
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const userRegister = createAsyncThunk("auth/userregister", async (credentials, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
        const { data } = await request.post("/auth/local/register", credentials);
        return data
    } catch (error) {
        return rejectWithValue(error)
    }
})

const authSlice = createSlice({
  initialState,
  name: "auth",
    reducers: {
    },
    extraReducers: (builder) => {
        builder
          .addCase(userLogin.pending, (state) => {
            state.loading = true
          })
          .addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
            const date = new Date();
            const IN_DAYS = 7;
            const EXPIRES_AT_DAYS = 1000 * 60 * 60 * 24 * IN_DAYS;
            date.setTime(date.getTime() + EXPIRES_AT_DAYS );
            const options = { path: "/", expires: date };
            CookieService.set("jwt", action.payload.jwt , options);
            toast({
              description: "تم تسجيل الدخول بنجاح",
              status: "success",
              duration: 3000,
              position: "bottom-left"
            });
            window.location.reload();
          })
          .addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
            toast({
              description: action.payload.response.data.error.message === "Invalid identifier or password" ? 
              "الايميل او الباسورد غلط" : action.payload.response.data.error.message,
              status: "error",
              duration: 3000,
              position: "bottom-left"
            });
          });

          builder
          .addCase(userRegister.pending, (state) => {
          state.loading = true
          })
          .addCase(userRegister.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
            toast({
              title: "تم إنشاء الحساب بنجاح",
              description: "تم إنشاء الحساب بنجاح, قم بتسجيل الدخول الان",
              status: "success",
              duration: 7000,
              position: "bottom-left"
            });
          })
          .addCase(userRegister.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
            toast({
              title: action.payload.response.data.error.message === "Email or Username are already taken" ? "اكتب ايميل او اسم مستخدم مختلف" :
              action.payload.response.data.error.message === "This attribute must be unique" ? "رقم التليفون موجود" : null ,

              description: action.payload.response.data.error.message === "Email or Username are already taken" ? 
              "اكتب ايميل او اسم مستخدم مختلف عشان الايميل او اسم المستخدم حد مستخدمهم غيرك" : 
              action.payload.response.data.error.message === "This attribute must be unique" ? "رقم التليفون دة موجود قبل كدة اكتب رقم جديد او اعمل تسجيل دخول بنفس الرقم" : 
              action.payload.response.data.error.message,
              
              status: "error",
              duration: 7000,
              position: "bottom-left"
            });
          });
    }
})

export const selectAuth = ({ auth }) => auth;
export default authSlice.reducer;