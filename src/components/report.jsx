import { MdDateRange } from "react-icons/md";
import { FaHourglassHalf } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const Report = ({ start, end, lat, lon }) => {
  return (
    <div className="flex flex-col p-5 rounded-md bg-blue-800/60 shadow-lg shadow-800/50 text-[2rem]">
      <div className="flex items-center [&>*]:mx-2">
        <MdDateRange />
        <span>{start}</span>
      </div>
      <div className="flex items-center [&>*]:mx-2">
        <FaHourglassHalf />
        <span>{end}</span>
      </div>
      <div className="flex items-center [&>*]:mx-2">
        <FaLocationDot />
        <span>{`${lat}, ${lon}`}</span>
      </div>
    </div>
  );
};

export default Report;
