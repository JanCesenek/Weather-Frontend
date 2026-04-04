import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ImExit } from "react-icons/im";

const ReportDetail = ({ data, exit }) => {
  const [cloudCoverChecked, setCloudCoverChecked] = useState(true);
  const [humidityChecked, setHumidityChecked] = useState(true);
  const [precipitationIntensityChecked, setPrecipitationIntensityChecked] = useState(true);
  const [temperatureChecked, setTemperatureChecked] = useState(true);
  const [windSpeedChecked, setWindSpeedChecked] = useState(true);

  const allData = () => {
    const dynamicData = [];
    data?.intervals?.map((el) => {
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
      <div className="flex flex-col mt-10 text-[2rem]">
        {cloudCoverChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2.5rem] underline mb-2">Cloud cover info:</p>
            <p>Max cloud cover: {Math.max(...allData().map((d) => d.cloudCover))} %</p>
            <p>Min cloud cover: {Math.min(...allData().map((d) => d.cloudCover))} %</p>
            <p>
              Average cloud cover:{" "}
              {(allData().reduce((acc, d) => acc + d.cloudCover, 0) / allData().length).toFixed(2)}{" "}
              %
            </p>
          </div>
        )}
        {humidityChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2.5rem] underline mb-2">Humidity info:</p>
            <p>Max humidity: {Math.max(...allData().map((d) => d.humidity))} %</p>
            <p>Min humidity: {Math.min(...allData().map((d) => d.humidity))} %</p>
            <p>
              Average humidity:{" "}
              {(allData().reduce((acc, d) => acc + d.humidity, 0) / allData().length).toFixed(2)} %
            </p>
          </div>
        )}
        {precipitationIntensityChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2.5rem] underline mb-2">Precipitation intensity info:</p>
            <p>
              Max precipitation intensity:{" "}
              {Math.max(...allData().map((d) => d.precipitationIntensity))} mm/h
            </p>
            <p>
              Min precipitation intensity:{" "}
              {Math.min(...allData().map((d) => d.precipitationIntensity))} mm/h
            </p>
            <p>
              Average precipitation intensity:{" "}
              {(
                allData().reduce((acc, d) => acc + d.precipitationIntensity, 0) / allData().length
              ).toFixed(2)}{" "}
              mm/h
            </p>
          </div>
        )}
        {temperatureChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2.5rem] underline mb-2">Temperature info:</p>
            <p>Max temperature: {Math.max(...allData().map((d) => d.temperature))} °C</p>
            <p>Min temperature: {Math.min(...allData().map((d) => d.temperature))} °C</p>
            <p>
              Average temperature:{" "}
              {(allData().reduce((acc, d) => acc + d.temperature, 0) / allData().length).toFixed(2)}{" "}
              °C
            </p>
          </div>
        )}
        {windSpeedChecked && (
          <div className="flex flex-col my-5">
            <p className="text-[2.5rem] underline mb-2">Wind speed info:</p>
            <p>Max wind speed: {Math.max(...allData().map((d) => d.windSpeed))} m/s</p>
            <p>Min wind speed: {Math.min(...allData().map((d) => d.windSpeed))} m/s</p>
            <p>
              Average wind speed:{" "}
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
