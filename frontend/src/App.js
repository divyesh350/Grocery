// import logo from "./logo.svg";
import "./App.css";
import Header from "./component/Header";
import { Outlet } from "react-router-dom";
import  { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import {setDataProduct} from "./redux/productSlide"
import { useDispatch, useSelector } from "react-redux";


function App() {
 const dispatch = useDispatch()
 const productData = useSelector((state)=>state.product)
 
  useEffect(()=>{
  (async()=>{
    const resData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/product`)
    const data = await resData.json()
    console.log(data)  // display the data in console for debugging  // remove this line in production code  //
    dispatch(setDataProduct(data))
  })()
 },[])
 
  return (
    <>
    <Toaster />
      <Header />
      <main className="pt-16 bg-slate-100 min-h-[calc(100vh)]">
        <Outlet></Outlet>
      </main>
    </>
  );
}


export default App;
