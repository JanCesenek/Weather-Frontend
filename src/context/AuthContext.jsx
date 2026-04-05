import { createContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Error from "../audio/Error.mp3";
import Hot from "../audio/Hot.mp3";
import Cold from "../audio/Cold.mp3";
import Wind from "../audio/Wind.mp3";
import Rain from "../audio/Rain.mp3";

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
      toast.success(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
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
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else if (state === "hot") {
      const audio = new Audio(Hot);
      audio.play();
      toast.warn(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else if (state === "cold") {
      const audio = new Audio(Cold);
      audio.play();
      toast.warn(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else if (state === "wind") {
      const audio = new Audio(Wind);
      audio.play();
      toast.warn(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else if (state === "rain") {
      const audio = new Audio(Rain);
      audio.play();
      toast.warn(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
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
