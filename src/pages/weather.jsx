import { useState, useEffect, useContext } from "react";
import { api } from "../core/api";
import { useUpdate } from "../hooks/use-update";
import { AuthContext } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { goldIcon, greenIcon, purpleIcon } from "../core/icons";
import Button from "../components/button";
import ReportDetail from "../components/reportDetail";

const Weather = () => {
  const { data: uData, refetch: uRefetch, isLoading: uLoading } = useUpdate("/users");
  const { data: dData, refetch: dRefetch, isLoading: dLoading } = useUpdate("/data");

  useEffect(() => {
    const refetch = async () => {
      await uRefetch();
      await dRefetch();
    };
    refetch();
  }, []);

  const { notifyContext } = useContext(AuthContext);

  const lat = localStorage.getItem("lat");
  const lon = localStorage.getItem("lon");
  const [coords, setCoords] = useState([Number(lat).toFixed(2), Number(lon).toFixed(2)]);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState(false);

  const curUser = localStorage.getItem("curUser");
  const getUser = uData?.find((user) => user.username === curUser);
  const userID = getUser?.id;

  const getDynamicTimeRange = () => {
    const now = new Date();

    const startTime = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0),
    );

    const endTime = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 4, 0, 0, 0),
    );

    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  };

  console.log(getDynamicTimeRange().startTime, getDynamicTimeRange().endTime);

  const MapEventHandler = () => {
    const map = useMap();

    useEffect(() => {
      const handleMoveEnd = () => {
        const center = map.getCenter();
        setCoords([center.lat.toFixed(2), center.lng.toFixed(2)]);
      };

      map.on("moveend", handleMoveEnd);

      return () => {
        map.off("moveend", handleMoveEnd);
      };
    }, [map]);

    return null;
  };

  // Search component necessary for creating a search field in Leaflet map allowing user to search for any location all around the world
  const Search = (props) => {
    const map = useMap();
    const { provider } = props;

    useEffect(() => {
      const searchControl = new GeoSearchControl({
        provider,
      });

      map.addControl(searchControl);
      map.on("moveend", () => {
        const center = map.getCenter();
        setCoords([center.lat.toFixed(2), center.lng.toFixed(2)]);
      });

      return () => map.removeControl(searchControl);
    }, [props]);

    return null;
  };

  const fetchWeatherData = async () => {
    try {
      setSubmitting(true);
      const { startTime, endTime } = getDynamicTimeRange();
      const response = await fetch(
        `https://api.tomorrow.io/v4/timelines?location=${coords[0]},${coords[1]}&timesteps=1h&startTime=${startTime}&endTime=${endTime}&apikey=3xG9VdIyC6AmTt8vlWaiw6F0WJEVV7Jt&fields=temperature,precipitationIntensity,humidity,windSpeed,cloudCover`,
      );
      const finalData = await response.json();
      setResult(finalData);
      console.log(finalData);

      if (curUser) {
        const postReqPayload = {
          userID,
          data: finalData,
          startDate: startTime,
          endDate: endTime,
          lat: String(coords[0]),
          lon: String(coords[1]),
        };

        await api
          .post("/data", postReqPayload)
          .then(async () => {
            await dRefetch();
            notifyContext("Weather data successfully saved to your account!", "success");
          })
          .catch((err) => {
            console.log(`Post req - ${err}`);
            notifyContext("Failed to save weather data to your account.", "error");
          });
      } else {
        notifyContext(
          "Weather data fetched successfully! Log in to save it to your account.",
          "success",
        );
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center [&>*]:my-5">
      <div className="text-[3.5rem] p-5 text-white bg-black/50 rounded-md shadow-lg shadow-blue-500/50">
        <h1>Weather Homepage</h1>
      </div>
      <div className="flex flex-col items-center [&>*]:my-5">
        <MapContainer
          className="!w-[60rem] !h-[30rem] !text-black rounded-lg"
          center={coords}
          zoom={13}
          scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Search provider={new OpenStreetMapProvider()} />
          <MapEventHandler />
          <Marker position={coords} icon={greenIcon}>
            <Popup>Default marker - controllable. This location will be saved.</Popup>
          </Marker>
        </MapContainer>
        <Button
          title={submitting ? "Submitting..." : `Display data for ${coords[0]}, ${coords[1]}`}
          click={fetchWeatherData}
          classes={submitting ? "opacity-50 pointer-events-none" : ""}
        />
      </div>
      {result && <ReportDetail data={result?.data?.timelines[0]} exit={() => setResult(false)} />}
    </div>
  );
};

export default Weather;
