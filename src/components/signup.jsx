import { useState, useContext } from "react";
import { Form } from "react-router-dom";
import Button from "./button";
import { api } from "../core/api";
import UseInput from "../hooks/use-input";
import { useUpdate } from "../hooks/use-update";
import { AuthContext } from "../context/AuthContext";

const SignUp = ({ swap }) => {
  const { notifyContext, logIn } = useContext(AuthContext);

  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    changeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
    reset: usernameReset,
  } = UseInput(
    (value) =>
      value.length >= 6 &&
      value.length <= 16 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /^[A-Za-z0-9]*$/.test(value),
  );

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = UseInput(
    (value) =>
      value.length >= 8 &&
      value.length <= 16 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[$&+,:;=?@#|'"<>.⌃*()%!-_]/.test(value),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refetch } = useUpdate("/users");

  const addBearerToken = (token) => {
    if (!token) {
      console.log("Token can't be undefined or null.");
      return;
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const createNewUser = async (e) => {
    e.preventDefault();
    const username = usernameValue[0]?.toUpperCase() + usernameValue?.slice(1).toLowerCase();

    const postReqPayload = {
      username,
      password: passwordValue,
    };
    setIsSubmitting(true);
    await api
      .post("/signup", postReqPayload)
      .then(async (res) => {
        await refetch();
        const token = res.data.token;
        addBearerToken(token);
        logIn(username, token);
        notifyContext(`Welcome, ${username}!`, "success");
      })
      .catch((err) => {
        console.log(`Post req err - ${err}`);
        notifyContext("Invalid credentials! Try again...", "error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const validForm = usernameIsValid && passwordIsValid;

  return (
    <div className="flex flex-col items-center text-[1.3rem]">
      <div className="w-[50rem] mt-10 bg-gradient-to-b from-black/50 to-blue-800/50 shadow-lg shadow-black px-5 py-2 rounded-md">
        <h2 className="text-[2rem] text-center">Validation rules:</h2>
        <p>Username: 6-16 characters, upper+lowercase and at least one number</p>
        <p>
          Password: 8-16 characters, must contain lower+uppercase, number and a special character
        </p>
        <p className="text-blue-400 font-bold">
          Note: It won't be possible to submit the form until the conditions are met!
        </p>
      </div>
      <div className="w-[50rem] bg-gradient-to-b from-black/50 to-blue-800/50 shadow-lg shadow-black rounded-md mt-10 bg-black bg-opacity-50 p-5">
        <Form method="post" className="flex flex-col items-start [&>*]:my-2 p-2 text-[1.8rem]">
          <div className="flex">
            <label htmlFor="username" className="min-w-[15rem] ml-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={usernameValue}
              onChange={usernameChangeHandler}
              onBlur={usernameBlurHandler}
              className={`bg-black/20 shadow-md shadow-black rounded-md focus:outline-none ${
                usernameHasError && "border !border-blue-300 animate-pulse"
              }`}
            />
          </div>
          <div className="flex">
            <label htmlFor="password" className="min-w-[15rem] ml-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordValue}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              className={`bg-black/20 shadow-md shadow-black rounded-md focus:outline-none ${
                passwordHasError && "border !border-blue-300 animate-pulse"
              }`}
            />
          </div>
          <Button
            title={isSubmitting ? "Creating..." : "Create New User"}
            classes={`self-center !mt-8 ${
              (!validForm || isSubmitting) && "pointer-events-none opacity-50"
            }`}
            click={createNewUser}
          />
        </Form>
      </div>
      {/* {isSubmitting && <Submitting />} */}
      <p
        className="my-10 text-blue-400 underline hover:cursor-pointer text-[1.5rem]"
        onClick={swap}>
        Already have an account? Click here to log in!
      </p>
    </div>
  );
};

export default SignUp;
