import { Outlet } from "react-router-dom";
import { TiWeatherPartlySunny } from "react-icons/ti";
import MainNavigation from "../components/mainNavigation";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Root = () => {
  return (
    <div className="w-full flex flex-col min-h-screen bg-gradient-to-b from-black/80 to-black/80 text-blue-100">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
      <div className="text-[5rem] flex items-center [&>*]:mx-2 bg-black/30 rounded-md shadow-md shadow-blue-500/20 p-10 self-center mt-10 font-bold">
        <TiWeatherPartlySunny />
        <h1>Weather Explorer</h1>
      </div>
      <MainNavigation />
      <Outlet />
    </div>
  );
};

export default Root;
