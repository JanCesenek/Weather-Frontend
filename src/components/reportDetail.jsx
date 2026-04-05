import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BsThermometerSnow } from "react-icons/bs";
import { MdOutlineSecurity } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { GiDesert, GiBrainFreeze, GiWhirlwind } from "react-icons/gi";
import { FaSun } from "react-icons/fa";
import { LuWind } from "react-icons/lu";
import { FaCloudRain } from "react-icons/fa";
import { FaHouseFloodWater } from "react-icons/fa6";
import { TbMessage2Search } from "react-icons/tb";

const ReportDetail = ({ data, exit, hot, cold, wind, rain }) => {
  const [cloudCoverChecked, setCloudCoverChecked] = useState(true);
  const [humidityChecked, setHumidityChecked] = useState(true);
  const [precipitationIntensityChecked, setPrecipitationIntensityChecked] = useState(true);
  const [temperatureChecked, setTemperatureChecked] = useState(true);
  const [windSpeedChecked, setWindSpeedChecked] = useState(true);

  const reportData = data?.intervals;

  const allData = () => {
    const dynamicData = [];
    reportData?.map((el) => {
      const timelineOrigin = new Date(el?.startTime).toISOString();
      const timeline = timelineOrigin.slice(0, 10) + " " + timelineOrigin.slice(11, 16);
      dynamicData.push({
        cloudCover: el?.values?.cloudCover,
        humidity: el?.values?.humidity,
        precipitationIntensity: el?.values?.precipitationIntensity,
        temperature: el?.values?.temperature,
        windSpeed: el?.values?.windSpeed,
        timeline,
      });
    });
    return dynamicData;
  };

  // Generating weather report based on data
  const generateForecast = () => {
    const cloudCoverValues = reportData?.map((el) => el?.values?.cloudCover);
    const humidityValues = reportData?.map((el) => el?.values?.humidity);
    const precipitationIntensityValues = reportData?.map(
      (el) => el?.values?.precipitationIntensity,
    );
    const temperatureValues = reportData?.map((el) => el?.values?.temperature);
    const windSpeedValues = reportData?.map((el) => el?.values?.windSpeed);

    const evaluateCloudCover = (values) => {
      const totalHours = values.length;
      const cloudyHours = values.filter((v) => v > 60).length;
      const clearHours = values.filter((v) => v < 20).length;

      const cloudyPercentage = (cloudyHours / totalHours) * 100;
      const clearPercentage = (clearHours / totalHours) * 100;

      if (cloudyPercentage > 50) {
        return "Overcast.";
      } else if (clearPercentage > 50) {
        return "Clear skies.";
      } else {
        return "Partly cloudy.";
      }
    };

    const evaluateHumidity = (values) => {
      const avgHumidity = values.reduce((acc, v) => acc + v, 0) / values.length;
      if (avgHumidity > 70) {
        return "High humidity, expect muggy conditions.";
      } else if (avgHumidity < 40) {
        return "Low humidity, expect dry conditions.";
      } else {
        return "Moderate humidity levels.";
      }
    };

    const evaluatePrecipitation = (values) => {
      const rainyHours = values.filter((value) => value > 1).length;
      const drizzleHours = values.filter((value) => value > 0.1 && value <= 1).length;

      if (rainyHours > drizzleHours) return "Rainy.";
      if (drizzleHours > 0) return "Slight drizzle.";
      return "No rain.";
    };

    const evaluateTemperature = (values) => {
      const avgTemp = values.reduce((sum, value) => sum + value, 0) / values.length;
      if (avgTemp > 30) return "Hot temperatures.";
      if (avgTemp > 20) return "Warm temperatures.";
      if (avgTemp > 10) return "Mild temperatures.";
      if (avgTemp > 0) return "Cold temperatures.";
      return "Freezing temperatures.";
    };

    const evaluateWindSpeed = (values) => {
      const avgWind = values.reduce((sum, value) => sum + value, 0) / values.length;
      if (avgWind > 10) return "High wind.";
      if (avgWind > 5) return "Medium wind.";
      if (avgWind > 1) return "Low wind.";
      return "No wind.";
    };

    return `${evaluateCloudCover(cloudCoverValues)} ${evaluateHumidity(humidityValues)} ${evaluatePrecipitation(precipitationIntensityValues)} ${evaluateTemperature(temperatureValues)} ${evaluateWindSpeed(windSpeedValues)}`;
  };

  const tempValues = reportData?.map((el) => el?.values?.temperature);
  const hotWarning = tempValues?.some((temp) => temp > 30);
  const hotAlert = tempValues?.some((temp) => temp > 40);
  const coldAlert = tempValues?.some((temp) => temp < -10);
  const coldWarning = tempValues?.some((temp) => temp < 0);

  const windValues = reportData?.map((el) => el?.values?.windSpeed);
  const windWarning = windValues?.some((wind) => wind > 10);
  const windAlert = windValues?.some((wind) => wind > 17);

  const rainValues = reportData?.map((el) => el?.values?.precipitationIntensity);
  const rainWarning = rainValues?.some((rain) => rain > 10);
  const rainAlert = rainValues?.some((rain) => rain > 50);

  useEffect(() => {
    if (hotAlert) {
      hot();
    } else if (coldAlert) {
      cold();
    } else if (windAlert) {
      wind();
    } else if (rainAlert) {
      rain();
    }
  }, [hotAlert, coldAlert, windAlert, rainAlert, hot, cold, wind, rain]);

  const safeWeather =
    !hotWarning &&
    !hotAlert &&
    !coldWarning &&
    !coldAlert &&
    !windWarning &&
    !windAlert &&
    !rainWarning &&
    !rainAlert;

  const TooltipContent = (props) => {
    if (!props.active || !props.payload) {
      return;
    }
    const data = props.payload[0].payload;
    return (
      <div className="p-2 bg-white rounded-md shadow-md text-black text-[1.5rem]">
        <p className="text-[1.8rem]">{`Date: ${data.timeline}`}</p>
        {cloudCoverChecked && <p>{`Cloud Cover: ${data.cloudCover} %`}</p>}
        {humidityChecked && <p>{`Humidity: ${data.humidity} %`}</p>}
        {precipitationIntensityChecked && (
          <p>{`Precipitation Intensity: ${data.precipitationIntensity} mm/h`}</p>
        )}
        {temperatureChecked && <p>{`Temperature: ${data.temperature} °C`}</p>}
        {windSpeedChecked && <p>{`Wind Speed: ${data.windSpeed} m/s`}</p>}
      </div>
    );
  };

  return (
    <div
      className={`p-10 relative rounded-md w-[90%] md:w-[90rem] xl:w-[120rem] bg-black shadow-lg shadow-blue-800/50`}>
      <ImExit
        className="absolute top-[2rem] right-[2rem] hover:cursor-pointer text-blue-200 text-[2rem]"
        onClick={exit}
      />
      {/* Graph */}
      <div className="w-full h-[30rem] xl:h-[40rem] mt-10">
        <ResponsiveContainer>
          <LineChart data={allData()} margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
            <XAxis dataKey="timeline" />
            <YAxis />
            <Tooltip content={<TooltipContent />} />
            <Legend />
            {cloudCoverChecked && (
              <Line type="monotone" dataKey="cloudCover" stroke="#8884d8" dot={{ r: 1 }} />
            )}
            {humidityChecked && (
              <Line type="monotone" dataKey="humidity" stroke="#ff17e6" dot={{ r: 1 }} />
            )}
            {precipitationIntensityChecked && (
              <Line
                type="monotone"
                dataKey="precipitationIntensity"
                stroke="#ffc658"
                dot={{ r: 1 }}
              />
            )}
            {temperatureChecked && (
              <Line type="monotone" dataKey="temperature" stroke="#ff0000" dot={{ r: 1 }} />
            )}
            {windSpeedChecked && (
              <Line type="monotone" dataKey="windSpeed" stroke="#187908" dot={{ r: 1 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Checkboxes */}
      <div className="flex flex-col text-[1.5rem]">
        <div className="flex items-center [&>*]:mx-2">
          <label htmlFor="cloudCover">Cloud cover (%):</label>
          <input
            type="checkbox"
            name="cloudCover"
            id="cloudCover"
            checked={cloudCoverChecked}
            onChange={() => setCloudCoverChecked(!cloudCoverChecked)}
          />
        </div>
        <div className="flex items-center [&>*]:mx-2">
          <label htmlFor="humidity">Humidity (%):</label>
          <input
            type="checkbox"
            name="humidity"
            id="humidity"
            checked={humidityChecked}
            onChange={() => setHumidityChecked(!humidityChecked)}
          />
        </div>
        <div className="flex items-center [&>*]:mx-2">
          <label htmlFor="precipitationIntensity">Precipitation Intensity (mm/h):</label>
          <input
            type="checkbox"
            name="precipitationIntensity"
            id="precipitationIntensity"
            checked={precipitationIntensityChecked}
            onChange={() => setPrecipitationIntensityChecked(!precipitationIntensityChecked)}
          />
        </div>
        <div className="flex items-center [&>*]:mx-2">
          <label htmlFor="temperature">Temperature (°C):</label>
          <input
            type="checkbox"
            name="temperature"
            id="temperature"
            checked={temperatureChecked}
            onChange={() => setTemperatureChecked(!temperatureChecked)}
          />
        </div>
        <div className="flex items-center [&>*]:mx-2">
          <label htmlFor="windSpeed">Wind Speed (m/s):</label>
          <input
            type="checkbox"
            name="windSpeed"
            id="windSpeed"
            checked={windSpeedChecked}
            onChange={() => setWindSpeedChecked(!windSpeedChecked)}
          />
        </div>
      </div>
      {/* Extreme weather warnings + weather report */}
      <div className="my-10 font-bold text-[2.5rem]">
        <p className="flex items-center my-2 [&>*]:mx-2">
          <TbMessage2Search />
          <span>{generateForecast()}</span>
        </p>
        {safeWeather && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-green-500">
            <MdOutlineSecurity />
            <span>The weather is safe, no anomalies detected.</span>
          </p>
        )}
        {!hotAlert && hotWarning && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-yellow-500">
            <FaSun />
            <span>
              It's going to be really hot, make sure to bring sunscreen and stay hydrated!
            </span>
          </p>
        )}
        {hotAlert && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-red-500 font-extrabold">
            <GiDesert />
            <span>Scorching weather alert, take necessary precautions! Risk of heatstroke!</span>
          </p>
        )}
        {!coldAlert && coldWarning && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-blue-600">
            <BsThermometerSnow />
            <span>It's going to be really cold, make sure to dress warmly!</span>
          </p>
        )}
        {coldAlert && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-blue-800 font-extrabold">
            <GiBrainFreeze />
            <span>Freezing weather alert, take necessary precautions! Risk of frostbite!</span>
          </p>
        )}
        {!windAlert && windWarning && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-gray-300">
            <LuWind />
            <span>It's going to be really windy, be careful!</span>
          </p>
        )}
        {windAlert && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-gray-400 font-extrabold">
            <GiWhirlwind />
            <span>Strong wind alert, do not go outside if possible!</span>
          </p>
        )}
        {!rainAlert && rainWarning && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-blue-100">
            <FaCloudRain />
            <span>
              Heavy rain expected, bring an umbrella! Flash floods possible, careful when driving!
            </span>
          </p>
        )}
        {rainAlert && (
          <p className="flex items-center my-2 [&>*]:mx-2 text-blue-300 font-extrabold">
            <FaHouseFloodWater />
            <span>Flood alert, take necessary precautions! Driving not recommended!</span>
          </p>
        )}
      </div>
      {/* Data - min, max, avg */}
      <div className="flex flex-col mt-10 text-[1.8rem]">
        {cloudCoverChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2rem] underline mb-2">Cloud cover info:</p>
            <p>Max. cloud cover: {Math.max(...allData().map((d) => d.cloudCover))} %</p>
            <p>Min. cloud cover: {Math.min(...allData().map((d) => d.cloudCover))} %</p>
            <p>
              Avg. cloud cover:{" "}
              {(allData().reduce((acc, d) => acc + d.cloudCover, 0) / allData().length).toFixed(2)}{" "}
              %
            </p>
          </div>
        )}
        {humidityChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2rem] underline mb-2">Humidity info:</p>
            <p>Max. humidity: {Math.max(...allData().map((d) => d.humidity))} %</p>
            <p>Min. humidity: {Math.min(...allData().map((d) => d.humidity))} %</p>
            <p>
              Avg. humidity:{" "}
              {(allData().reduce((acc, d) => acc + d.humidity, 0) / allData().length).toFixed(2)} %
            </p>
          </div>
        )}
        {precipitationIntensityChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2rem] underline mb-2">Precipitation intensity info:</p>
            <p>
              Max. precipitation intensity:{" "}
              {Math.max(...allData().map((d) => d.precipitationIntensity))} mm/h
            </p>
            <p>
              Min. precipitation intensity:{" "}
              {Math.min(...allData().map((d) => d.precipitationIntensity))} mm/h
            </p>
            <p>
              Avg. precipitation intensity:{" "}
              {(
                allData().reduce((acc, d) => acc + d.precipitationIntensity, 0) / allData().length
              ).toFixed(2)}{" "}
              mm/h
            </p>
          </div>
        )}
        {temperatureChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2rem] underline mb-2">Temperature info:</p>
            <p>Max. temperature: {Math.max(...allData().map((d) => d.temperature))} °C</p>
            <p>Min. temperature: {Math.min(...allData().map((d) => d.temperature))} °C</p>
            <p>
              Avg. temperature:{" "}
              {(allData().reduce((acc, d) => acc + d.temperature, 0) / allData().length).toFixed(2)}{" "}
              °C
            </p>
          </div>
        )}
        {windSpeedChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2rem] underline mb-2">Wind speed info:</p>
            <p>Max. wind speed: {Math.max(...allData().map((d) => d.windSpeed))} m/s</p>
            <p>Min. wind speed: {Math.min(...allData().map((d) => d.windSpeed))} m/s</p>
            <p>
              Avg. wind speed:{" "}
              {(allData().reduce((acc, d) => acc + d.windSpeed, 0) / allData().length).toFixed(2)}{" "}
              m/s
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetail;
