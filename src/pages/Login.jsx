import logoIcon from '../assets/kalbe CH-logo-putih.png';
import imageIcon from '../assets/gambar.jpg';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginData } from "../features/part/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login () {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailHendeler = (event) => {
    setEmail(event.target.value);
  };
  const passwordHendeler = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const addLogin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }
     
    let tempData = {
      email: email,
      password: password,
    };

    const loginSuccess = await dispatch(loginData({ email, password }));
    

    if (loginSuccess) {
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to Stopwatch after 2 seconds
      }, 2000);
    }

  };

  return (
    <div className="min-h-screen flex justify-end">
    <div
    className="w-1/2 min-h-screen bg-no-repeat bg-left bg-cover"
    style={{ backgroundImage: `url(${imageIcon})` }}
  ></div>
    
      
      <div className="bg-hitam2 min-h-screen w-1/2 flex justify-center items-center">
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={logoIcon} alt="Logo" className="w-[180px]" />
            </div>

            {/* Welcome text */}
            <div>
              <span className="text-sm text-white">Welcome Back!</span>
              <h1 className="text-2xl font-bold mt-1 text-white">Login to your account</h1>
            </div>

            {/* Email Input */}
            <div className="mt-5">
              <label className="block text-md mb-2 text-white" htmlFor="email">Email</label>
              <input
                className="px-4 w-full border-2 border-white bg-hitam2 py-3 rounded-md text-sm outline-none text-white"
                type="email"
                id="email-address"
                name="email"
                autoComplete="email"
                  required
                onChange={emailHendeler}
                placeholder="Enter Email"
              />
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

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between">
              <div>
                <input className="cursor-pointer" type="checkbox" name="rememberme" />
                <span className="text-sm text-white"> Remember Me</span>
              </div>
              <span className="text-sm text-blue-700 hover:underline cursor-pointer" 
              onClick={() => {navigate(`/resetpass`);
            }}>Forgot password?</span>
            </div>

            {/* Login Button */}
            <div className="">
              <button className="mt-4 mb-3 w-full bg-hijau hover:bg-hijau2 text-white py-2 rounded-md transition duration-100"
              onClick={addLogin} type="button">
                Login now
              </button>
            </div>
          </form>

          <ToastContainer position="top-center" />

          {/* Sign Up Link */}
          <p className="mt-8 text-white">
            Don't have an account? <span className="font-bold text-white"> Register</span> <span className="cursor-pointer text-blue-600 underline" onClick={() => {
              navigate(`/register`);
            }}> Here!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
