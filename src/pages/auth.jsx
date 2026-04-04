import { useState, useContext, useEffect } from "react";
import { useUpdate } from "../hooks/use-update";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/login";
import SignUp from "../components/signup";
import Button from "../components/button";
import Report from "../components/report";
import ReportDetail from "../components/reportDetail";

const Auth = () => {
  const { data: uData, refetch: uRefetch, isLoading: uLoading } = useUpdate("/users");
  const { data: dData, refetch: dRefetch, isLoading: dLoading } = useUpdate("/data");

  useEffect(() => {
    const refetch = async () => {
      await uRefetch();
      await dRefetch();
    };
    refetch();
  }, []);

  const [newAccount, setNewAccount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [detail, setDetail] = useState(false);

  const { curUser, logOut } = useContext(AuthContext);

  return (
    <div
      className={`flex flex-col items-center w-full ${
        submitting && "pointer-events-none opacity-70"
      }`}>
      {curUser ? (
        <div className="w-full flex flex-col items-center [&>*]:my-5 my-10">
          <div className="text-[2rem]">{curUser} logged in</div>
          <Button title="Log Out" click={logOut} />
          {detail ? (
            <ReportDetail data={detail?.data?.data?.timelines[0]} exit={() => setDetail(false)} />
          ) : (
            dData?.map((el) => {
              const start = new Date(el?.data?.data?.timelines[0]?.startTime).toLocaleDateString();
              const end = new Date(el?.data?.data?.timelines[0]?.endTime).toLocaleDateString();
              return (
                <div
                  key={el.id}
                  onClick={() => setDetail(el)}
                  className="hover:cursor-pointer hover:scale-110">
                  <Report start={start} end={end} lat={el.lat} lon={el.lon} />
                </div>
              );
            })
          )}
        </div>
      ) : newAccount ? (
        <SignUp swap={() => setNewAccount(!newAccount)} />
      ) : (
        <Login swap={() => setNewAccount(!newAccount)} />
      )}
    </div>
  );
};

export default Auth;
