import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, Ticket, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const navigate = useNavigate();

  const { favoriteMovies } = useAppContext();

  const handleClose = () => {
    scrollTo(0, 0);
    setIsOpen(false);
  };

  return (
    // thanh navigation
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>

      {/* <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-[25px] py-[18px] max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] max-h-[55px] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-white"
          onClick={() => setIsOpen(!isOpen)}
        />

        <NavLink
          to="/"
          end
          onClick={handleClose}
          className={({ isActive }) =>
            `${linkBaseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/movies"
          onClick={handleClose}
          className={({ isActive }) =>
            `${linkBaseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          Movies
        </NavLink>

        <NavLink
          to="/favorite"
          onClick={handleClose}
          className={({ isActive }) =>
            `${linkBaseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          Favorites
        </NavLink>
      </div> */}

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-[25px] py-[18px] max-md:h-screen md:h-[55px] min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <NavLink
          to="/"
          end
          onClick={handleClose}
          className={({ isActive }) =>
            `px-[10px] py-[8px] hover:font-bold ${
              isActive
                ? "text-[#FFFFFF] bg-[#F84565] rounded-[90px]"
                : "hover:font-medium"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/movies"
          onClick={handleClose}
          className={({ isActive }) =>
            `px-[10px] py-[8px] ${
              isActive
                ? "text-[#FFFFFF] bg-[#F84565] rounded-[90px]"
                : "hover:font-medium"
            }`
          }
        >
          Movies
        </NavLink>

        {favoriteMovies.length > 0 && (
          <NavLink
            to="/favorite"
            onClick={handleClose}
            className={({ isActive }) =>
              `px-[10px] py-[8px] ${
                isActive
                  ? "text-[#FFFFFF] bg-[#F84565] rounded-[90px]"
                  : "hover:font-medium"
              }`
            }
          >
            Favorites
          </NavLink>
        )}
      </div>

      {/* search và login  */}
      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default NavBar;
