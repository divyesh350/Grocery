import React, { useState } from 'react'
import loginSignupImage from "../assets/login-animation.gif"
import {BiHide, BiShow} from "react-icons/bi"
import { Link } from 'react-router-dom'
import {toast} from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginRedux } from '../redux/userSlice'

const Login = () => {
  const [showPassword,setShowPassword]=useState(false)  
 
  const [data , setData]=useState({
   
    email:'',
    password:''
  
  })
 const navigate = useNavigate()
 const userData = useSelector(state => state)

 const dispatch = useDispatch()
  const handleShowPassword=()=>{
    setShowPassword(preve => !preve)
  }
  
  const handleOnchange = (e)=>{
    const {name,value}=e.target
    setData((preve)=>{
      return {
       ...preve,
        [name]:value
      }
    })
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const {email,password}=data
   if( email && password ){

   
    const fetchData = await fetch(
      `${process.env.REACT_APP_SERVER_DOMIN}/login`,
     {
       method: "POST",
       headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
       }
       
     );
     const dataRes = await fetchData.json();
      const token = dataRes
     
     
     if(dataRes.message){
      toast(dataRes.message)
      if(dataRes.alert){
       dispatch(loginRedux(dataRes))
        setTimeout(()=>{
        navigate("/")
       },1000);
       
       
      }
      localStorage.setItem('token',token)
      console.log(userData)
    }
    else{
      if(dataRes.message){
        // alert(dataRes.message)
        toast(dataRes.message)
        if(dataRes.alert===false){
          navigate("/signup")
         }
      }
    }
 
  }
   else{
    alert("Please Enter Required Fields")
  }
    
  }
  return (
    <div className='p-3 md:p-4'>
     <div className='w-full max-w-sm bg-white m-auto flex items-center flex-col p-4'>
       
        <div className='w-20 overflow-hidden rounded-full drop-shadow-md shadow-md'>
          <img src={loginSignupImage} alt={"user profile icon"}className='w-full'></img>
        </div>
        <form className='w-full py-3' onSubmit={handleSubmit}>
         
         
         
         
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' name='email' className='w-full px-2 mt-1 py-1 bg-slate-200 outline-none rounded-md mb-2' value={data.email}
          onChange={handleOnchange}/>
         
          <label htmlFor='password'>Password</label>
          <div className='flex px-2 mt-1 mb-2 py-1 bg-slate-200 rounded-md'>
          <input type={showPassword?"text":"password"} id='password' name='password' className='w-full  bg-slate-200 outline-none  ' value={data.password} onChange={handleOnchange}/>
          <span className='flex text-xl cursor-pointer' onClick={handleShowPassword}
          >{ showPassword ? <BiShow/> : <BiHide/>}</span>
          </div>
         
         

          <button className='max-w-[150px] m-auto p-2 bg-orange-500 w-full hover:bg-orange-600 cursor-pointer text-xl rounded-lg mt-4 text-white font-medium text-center'>Login</button>
        </form>
        <p className='text-center text-gray-500 mt-2'>Dont't have an account? <Link to={"/register"} className='text-orange-500 hover:text-orange-600'>Register</Link></p>
     </div>
    </div>
  )
}

export default Login