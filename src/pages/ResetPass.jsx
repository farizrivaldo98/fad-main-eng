import logoIcon from '../assets/kalbe CH-logo-putih.png';
import imageIcon from '../assets/gambar.jpg';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function ResetPass () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const [password, setPassword] = useState("");

    const passwordHendeler = (event) => {
        setPassword(event.target.value);
      };

    const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    };
    
    const handleRegister = () => {
        if (!password) {
          toast.error("All fields are required!");
          return;
        }

        const userPass = {
            password,
          };

        //   dispatch(registerData(userPass));
        
        setTimeout(() => {
        navigate("/login"); // Redirect to login page after registration
        }, 2000);
    };
    
  return (
    <div className="min-h-screen flex justify-end">
        <div className="w-1/2 min-h-screen bg-no-repeat bg-left bg-cover" style={{ backgroundImage: `url(${imageIcon})` }}></div>
        <div className="bg-hitam2 min-h-screen w-1/2 flex justify-center items-center">
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="flex justify-center mb-6">
                        <img src={logoIcon} alt="Logo" className="w-[180px]" />
                    </div>
                    <div>
                        <span className="text-sm text-white"></span>
                        <h1 className="text-2xl font-bold mt-1 text-white">Create a New Password</h1>
                    </div>
                    {/* Password Input */}
                    <div className="my-3 relative">
                    <label className="block text-md mb-2 text-white" htmlFor="password">Password</label>
                    <input
                        className="px-4 w-full border-2 border-white bg-hitam2 py-3 rounded-md text-sm outline-none text-white"
                        type={showPassword ? "text" : "password"} // Toggle between text and password
                        name="password"
                        id="password"
                        value={password}
                        autoComplete="current-password"
                        required
                        onChange={passwordHendeler}
                        placeholder="Enter Password"
                    />
                    {/* Eye icon inside password field */}
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-[45px] w-5 cursor-pointer text-white focus:outline-none">
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </button>
                    </div>
                    {/* Register Button */}
                    <div className="">
                    <button className="mt-4 mb-3 w-full bg-hijau hover:bg-hijau2 text-white py-2 rounded-md transition-all duration-300"
                    onClick={handleRegister} type="button">
                        Sign Up
                    </button>
                    </div>
                </form>
                <ToastContainer position="top-center" />
            </div>
        </div>
    </div>
  )
}

export default ResetPass;