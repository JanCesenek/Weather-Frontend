import { useState, useContext, useEffect } from "react";
import { useUpdate } from "../hooks/use-update";
import { AuthContext } from "../context/AuthContext";
import { api } from "../core/api";
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

  const { curUser, logOut, notifyContext } = useContext(AuthContext);
  const getUser = uData?.find((user) => user.username === curUser);
  const userID = getUser?.id;

  const deleteReport = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setSubmitting(true);
      await api
        .delete(`/data/${id}`)
        .then(async () => {
          await dRefetch();
          notifyContext("Report deleted successfully", "success");
        })
        .catch((err) => {
          console.log(`Delete req - ${err}`);
          notifyContext("Failed to delete report", "error");
        })
        .finally(() => setSubmitting(false));
    }
  };

  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      setSubmitting(true);
      await api
        .delete(`/users/${userID}`)
        .then(async () => {
          await uRefetch();
          logOut();
          notifyContext("Account deleted successfully", "success");
        })
        .catch((err) => {
          console.log(`Delete req - ${err}`);
          notifyContext("Failed to delete account", "error");
        })
        .finally(() => setSubmitting(false));
    }
  };

  const loading = uLoading || dLoading;

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div
      className={`flex flex-col items-center w-full ${
        submitting && "pointer-events-none opacity-70"
      }`}>
      {curUser ? (
        <div className="w-full flex flex-col items-center [&>*]:my-5 my-10">
          <div className="text-[2rem]">{curUser} logged in</div>
          <Button title="Log Out" click={logOut} />
          <Button title="Delete Account" click={deleteAccount} />
          {detail ? (
            <ReportDetail data={detail?.data?.data?.timelines[0]} exit={() => setDetail(false)} />
          ) : (
            dData?.map((el) => {
              if (el.userID === userID) {
                const start = new Date(
                  el?.data?.data?.timelines[0]?.startTime,
                ).toLocaleDateString();
                const end = new Date(el?.data?.data?.timelines[0]?.endTime).toLocaleDateString();
                return (
                  <div key={el.id}>
                    <Report
                      start={start}
                      end={end}
                      lat={el.lat}
                      lon={el.lon}
                      open={() => setDetail(el)}
                      remove={() => deleteReport(el.id)}
                    />
                  </div>
                );
              }
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
