import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Root from "./pages/root";
import Auth from "./pages/auth";
import Weather from "./pages/weather";

function App() {
  // Asking user for location - if blocked, coordinates set to 0,0 by default
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const { latitude } = pos.coords;
        const { longitude } = pos.coords;
        console.log(latitude, longitude);
        localStorage.setItem("lat", latitude);
        localStorage.setItem("lon", longitude);
      },
      function () {
        console.log("Could not get location!");
      },
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <Weather /> },
        { path: "auth", element: <Auth /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
