import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

import ProgressBar from "./progressbar";
  
function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Initially false

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        // console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const matchRoute = (route) => {
    return location.pathname === route;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="navbarContainer sticky top-0 left-0 z-1000">
      <div className="flex items-center justify-center bg-black border-b-[1px] border-b-richblack-800">
        <div className="flex flex-col md:flex-row w-full max-w-maxContent items-center justify-between px-4 py-2">
          <div className="flex items-center justify-between w-full md:w-auto px-1 py-1">
            <Link to="/" onClick={closeMobileMenu}>
              <img
                src={logo}
                alt="Logo"
                width={170}
                height={32}
                loading="lazy"
              />
            </Link>
            <button
              className="block md:hidden text-2xl text-richblack-25 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? "✖" : <AiOutlineMenu />}
            </button>
          </div>
          <nav
            className={`${
              mobileMenuOpen ? "block" : "hidden"
            } md:block mt-4 md:mt-0`}
          >
            <ul className="flex flex-col md:flex-row w-full max-w-maxContent items-center justify-between px-4 py-2 gap-y-4 md:gap-y-0 md:gap-x-14">
              {NavbarLinks.map(({ title, path }, index) => (
                <li className="relative group" key={index}>
                  {title === "Catalog" ? (
                    <div
                      className="relative flex items-center gap-1 cursor-pointer text-richblack-25 hover:text-yellow-25 transition duration-300 ease-in-out
                      after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-yellow-50 after:bottom-0 after:left-0 after:transition-all after:duration-700 after:ease-in-out group-hover:after:w-full"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={toggleDropdown}
                    >
                      <p>{title}</p>
                      <BsChevronDown />

                      {/* DROPDOWN MENU */}
                      {dropdownOpen && (
                        <div className="absolute top-full left-1/2 z-[1000] mt-2 w-[200px] lg:w-[300px] -translate-x-1/2 rounded-lg bg-richblack-5 p-4 text-richblack-900 shadow-lg transition-all duration-300">
                          <div className="absolute left-1/2 top-0 -z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 select-none rounded bg-richblack-5"></div>
                          {loading ? (
                            <p className="text-center">Loading...</p>
                          ) : subLinks && subLinks.length ? (
                            subLinks
                              .filter((subLink) => subLink?.courses?.length > 0)
                              .map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  key={i}
                                  className="hover:bg-richblack-400 hover:text-richblack-5 transition-colors duration-200"
                                  onClick={toggleDropdown}
                                >
                                <p
                                className="py-2 px-4 rounded-md text-richblack-900 hover:bg-richblack-400 hover:text-richblack-5 transition-colors duration-200"
                                  
                                >{subLink.name}</p>
                              </Link>

                              ))
                          ) : (
                            <p className="text-center">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={path} onClick={closeMobileMenu}>
                      <p
                        className={`transition duration-300 ease-in-out transform hover:text-yellow-25 hover:scale-105 relative 
                        after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-yellow-50 after:bottom-0 after:left-0 after:transition-all after:duration-700 after:ease-in-out hover:after:w-full ${
                          matchRoute(path) ? "text-yellow-25" : "text-richblack-25"
                        }`}
                      >
                        {title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div
            className={`${
              mobileMenuOpen ? "block" : "hidden"
            } md:block mt-2 md:mt-0`}
          >
            <div className="flex flex-col items-center md:flex-row md:items-center justify-center md:justify-start gap-y-4 md:gap-y-0 gap-x-8">
              {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link
                  to="/dashboard/cart"
                  className="relative"
                  onClick={closeMobileMenu}
                >
                  <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-500">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              {!token && (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-y-4 md:gap-y-0 md:gap-x-4">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <button
                      className={`rounded-md px-4 w-[90px] py-2 transition duration-300 hover:scale-95 ${
                        matchRoute("/login")
                          ? "bg-richblack-800 text-white"
                          : "bg-yellow-50 text-black hover:bg-richblack-800 hover:text-white "
                      }`}
                    >
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <button
                      
                      className={`rounded-md px-4 py-2 transition duration-300 hover:scale-95 ${
                        matchRoute("/signup")
                          ? "bg-richblack-800 text-white"
                          : "bg-blue-50 text-white hover:bg-richblack-800 hover:text-gray-200 "
                      }`}
                    >

                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
              {token && <ProfileDropdown />}
            </div>
          </div>
        </div>
      </div>
      <ProgressBar/>
    </div>
  );
}

export default Navbar;
