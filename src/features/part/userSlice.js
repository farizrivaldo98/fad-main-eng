import Axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      id_users: "",
      name: "",
      username: "",
      email: "",
      isAdmin: "",
      level: "",
      imagePath: "",
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

export function registerData(data) {
  return async () => {
    try {
      const response = await Axios.post(
        "http://10.126.15.141:8002/part/register",
        data
      );

      console.log("Response data:", response.data); // Debugging line

      // Check if the response message indicates success
      if (response.data.message.toLowerCase() === "register success") {
        toast.success("Registration successful!");
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      toast.error("An error occurred during registration. Please try again.");
      console.error("Error:", error); // Log error for debugging
    }
  };
}


export function loginData(data) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        "http://10.126.15.141:8002/part/login",
        data
      );
      
      // If login is successful
      dispatch(setUser(response.data.data));
      localStorage.setItem("user_token", response.data.token);

      // Display success message
      toast.success("Login successful!");

      // Optional: Redirect user if necessary
      return true; // Indicate success
    } catch (error) {
      // Handle login failure and show error message
      toast.error("Login failed. Please check your credentials.");
      return false; // Indicate failure
    }
  };
}

export function CheckLogin(token) {
  return async (dispatch) => {
    let respons = await Axios.post(
      "http://10.126.15.141:8002/part/check-Login",
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (respons) {
      dispatch(setUser(respons.data.data));
    }
  };
}
