import React, { useState } from "react";
import loginSignupImage from "../assets/login-animation.gif";
import { BiHide, BiShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utils/ImagetoBase64";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
    image: "",
    message:"",
  });

  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };
  const handleshowConfirmPassword = () => {
    setshowConfirmPassword((preve) => !preve);
  };
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handelUploadProfileImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);

    setData((preve) => {
      return {
        ...preve,
        image: data,
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      
      const { firstName, email, password, confirmpassword ,token } = data;
       if (firstName && email && password && confirmpassword) {
       if (password === confirmpassword) {
         const fetchData = await fetch(
          `${process.env.REACT_APP_SERVER_DOMIN}/register`,
         {
           method: "POST",
           headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
           }
           
         );
         const dataRes = await fetchData.json();
         console.log(dataRes)
         if(dataRes.message){
           toast(dataRes.message)
           if(dataRes.alert){
            navigate("/login")
            localStorage.setItem('token',token)
            localStorage.setItem('loggedInUser', email)
           }
         }
         else{
          if(dataRes.message){
            // alert(dataRes.message)
            toast(dataRes.message)
            if(dataRes.alert===false){
              navigate("/login")
             }
          }
          // alert(dataRes.message).then(navigate("/login"))
           
         }
        }
        else{
          toast("Passwords do not match!");
        }

      }
      else{
        toast("Please fill all fields!");
      }
      
    }
    catch(e){
      console.log(e)
    }
    
    
  };

  return (
    <div className="p-3 md:p-4">
      <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4">
        {/* <h1 className='text-center text-2xl font-bold'>Sign up</h1> */}
        <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative">
          <img
            src={data.image ? data.image : loginSignupImage}
            alt="user icon"
            className="w-full h-full "
          ></img>

          <label htmlFor="profileImage">
            <div className="absolute bottom-0 h-1/3 bg-slate-500 bg-opacity-50 w-full text-center">
              <p className="text-sm p-1 text-white cursor-pointer">Upload</p>
            </div>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              onChange={handelUploadProfileImage}
              accept="image/*"
            />
          </label>
        </div>
        <form className="w-full py-3" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="w-full px-2 mt-1 py-1 bg-slate-200 outline-none rounded-md mb-2"
            value={data.firstName}
            onChange={handleOnchange}
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="w-full px-2 mt-1 py-1 bg-slate-200 outline-none rounded-md mb-2"
            value={data.lastName}
            onChange={handleOnchange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-2 mt-1 py-1 bg-slate-200 outline-none rounded-md mb-2"
            value={data.email}
            onChange={handleOnchange}
          />

          <label htmlFor="password">Password</label>
          <div className="flex px-2 mt-1 mb-2 py-1 bg-slate-200 rounded-md">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="w-full  bg-slate-200 outline-none  "
              value={data.password}
              onChange={handleOnchange}
            />
            <span
              className="flex text-xl cursor-pointer"
              onClick={handleShowPassword}
            >
              {showPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>

          <label htmlFor="confirmpassword">Confirm Password</label>
          <div className="flex px-2 mt-1 mb-2 py-1 bg-slate-200 rounded-md">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmpassword"
              name="confirmpassword"
              className="w-full  bg-slate-200 outline-none  "
              value={data.confirmpassword}
              onChange={handleOnchange}
            />
            <span
              className="flex text-xl cursor-pointer"
              onClick={handleshowConfirmPassword}
            >
              {showConfirmPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>

          <button className="max-w-[150px] m-auto p-2 bg-orange-500 w-full hover:bg-orange-600 cursor-pointer text-xl rounded-lg mt-4 text-white font-medium text-center">
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-500 mt-2">
          Already have an account?{" "}
          <Link to={"/login"} className="text-orange-500 hover:text-orange-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
