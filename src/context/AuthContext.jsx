import { createContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "../audio/Success.mp3";
import Error from "../audio/Error.mp3";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [curUser, setCurUser] = useState(localStorage.getItem("curUser"));

  const logIn = (username, token) => {
    localStorage.setItem("curUser", username);
    localStorage.setItem("token", token);
    setCurUser(username);
  };

  const logOut = () => {
    localStorage.removeItem("curUser");
    localStorage.removeItem("token");
    setCurUser(null);
  };

  const notifyContext = (msg, state) => {
    if (state === "success") {
      const audio = new Audio(Success);
      audio.play();
      toast.success(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else if (state === "error") {
      const audio = new Audio(Error);
      audio.play();
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ curUser, logIn, logOut, notifyContext }}>
      {children}
    </AuthContext.Provider>
  );
};
