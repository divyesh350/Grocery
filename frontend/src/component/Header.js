import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FaShoppingCart } from "react-icons/fa";

import { HiOutlineUserCircle } from "react-icons/hi";
import { logoutRedux } from "../redux/userSlice";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleShowMenu = () => {
    setShowMenu((preve) => !preve);
  };
  const handlelogout = () => {
    dispatch(logoutRedux());
    toast("logout Successfully");
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
  };
  const cartItemNumber = useSelector((state)=>state.product.cartItem)
  return (
    <header className="fixed shadow-md w-full h-16 px-2 md:px-4 z-50 bg-white">
      {/* desktop  */}

      <div className="flex items-center h-full justify-between">
        <Link to={""}>
          <div className="h-10">
            <img src={logo} className="h-full" alt="logo" />
          </div>
        </Link>
        <div className="flex items-center gap-4 md:gap-7">
          <nav className=" gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <Link to={"/"}>Home</Link>
            {/* <Link to={"menu/6700ea669a12ea5d2ebb71a8"}>Menu</Link> */}
            <Link to={"about"}>About</Link>
            <Link to={"contact"}>Contact</Link>
          </nav>
          <div className="text-2xl text-slate-600 relative">
         <Link to={"cart"}><FaShoppingCart />
            <div className="absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full m-0 p-0 text-sm text-center">
            {cartItemNumber.length}
            </div>
            </Link>
          </div>
          <div className="text-slate-600" onClick={handleShowMenu}>
            <div className="text-3xl cursor-pointer w-10 h-10 rounded-full overflow-hidden drop-shadow-md flex items-center">
              {userData.image ? (
                <img src={userData.image} className="h-full w-full" />
              ) : (
                <HiOutlineUserCircle />
              )}
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white p-2 shadow-md flex flex-col min-w-[120px] text-center">
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link
                    to={"Newproduct"}
                    className="whitespace-nowrap cursor-pointer hover:text-blue-500"
                  >
                    New Product
                  </Link>
                )}

                {userData.image ? (
                  <p
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={handlelogout}
                  >
                    Logout ({userData.firstName})
                  </p>
                ) : (
                  <Link
                    to={"login"}
                    className="whitespace-nowrap cursor-pointer hover:text-blue-500"
                  >
                    Login
                  </Link>
                )}
                  <nav className="text-base md:text-lg flex flex-col md:hidden">
            <Link to={"/"} className="px-2 hover:text-blue-500 py-1">Home</Link>
            <Link to={"menu/6700ea669a12ea5d2ebb71a8"} className="px-2 hover:text-blue-500 py-1">Menu</Link>
            <Link to={"about"} className="px-2 hover:text-blue-500 py-1">About</Link>
            <Link to={"contact"} className="px-2 hover:text-blue-500 py-1">Contact</Link>
          </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile  */}
    </header>
  );
};

export default Header;
