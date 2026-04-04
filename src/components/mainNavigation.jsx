import { useState } from "react";
import { NavLink } from "react-router-dom";

const MainNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const curUsername = localStorage.getItem("curUser");

  const removeBearerToken = () => {
    delete api.defaults.headers.common["Authorization"];
  };

  const logOut = (e) => {
    if (window.confirm("Are you sure you wanna log out?")) {
      removeBearerToken();
      localStorage.clear();
    } else e.preventDefault();
  };

  return (
    <nav className="flex justify-around w-full mt-4 text-[1.5rem] italic">
      <NavLink
        className={({ isActive }) => (isActive ? "text-blue-500 underline font-bold" : undefined)}
        to="/">
        Home
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "text-blue-500 underline font-bold flex" : "flex")}
        to="/auth">
        Auth
      </NavLink>
    </nav>
  );
};

export default MainNavigation;
