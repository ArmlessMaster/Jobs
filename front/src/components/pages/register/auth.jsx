import "./auth.scss";
import { Footer, Header } from "../../layout";
import { React, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Line from "../../../images/svgcomponents/Line 2.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Auth = () => {
  const [isRegisterForm, setIsRegisterForm] = useState(true);

  const toggleForm = () => {
    setIsRegisterForm(!isRegisterForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const history = useNavigate();
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const [formRegister, setFormRegister] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const changeHandlerLogin = (event) => {
    setFormLogin({ ...formLogin, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const changeHandlerRegister = (event) => {
    setFormRegister({
      ...formRegister,
      [event.target.name]: event.target.value,
    });
  };

  function notify() {
    toast.success("Welcome!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function notify1() {
    toast.error("Invalid Data!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
  function notify2() {
    toast.error("Passwords dont match!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  const loginHandler = async () => {
    try {
      const data = await request("/api/user/login", "POST", { ...formLogin });
      if (data.accessToken) {
        auth.login(data.accessToken);
        setTimeout(() => {
          history("/main");
        }, 1500);
        notify();
      } else {
        notify1();
      }
    } catch (e) {
      notify1();
    }
  };
  const registerHandler = async () => {
    try {
      const data = await request("/api/user/register", "POST", {
        ...formRegister,
      });
      if (data.accessToken) {
        auth.login(data.accessToken);
        notify();
        setTimeout(() => {
          history("/main");
        }, 1500);
      } else {
        notify1();
      }
    } catch (e) {
      notify1();
    }
  };

  return (
    <div className="auth-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {isRegisterForm ? (
        <form className="auth-content">
          <div className="flex-rows">
            <div className="right-side">
              <div className="this-is-your-first-visit">Authorization</div>
              <div className="group-61">
                <div className="username">Email</div>
                <div className="register-input">
                  <input
                    type="email"
                    className="username-1"
                    placeholder="Email"
                    name="email"
                    value={formLogin.email}
                    onChange={changeHandlerLogin}
                    required
                  ></input>
                </div>
              </div>
              <div className="group-61">
                <div className="username">Password</div>
                <div className="register-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="username-1"
                    placeholder="Password"
                    name="password"
                    value={formLogin.password}
                    onChange={changeHandlerLogin}
                    required
                  ></input>
                  <span
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 2L22 22"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </div>
              </div>
              <div className="group-61">
                <button
                  className="overlap-group-5"
                  type="submit"
                  onClick={loginHandler}
                  disabled={loading}
                >
                  <div className="place">Login</div>
                </button>
              </div>
            </div>
            <div className="center-line">
              <img className="line-2" src={Line} />
            </div>
            <div className="left-side">
              <div className="group-611">
                <div className="title-back-login">
                  Is this your first visit?
                </div>
                <div className="overlap-group-111" onClick={toggleForm}>
                  <div className="login-1-btn">Sign in</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form>
          <div className="flex-rows">
            <div className="left-side">
              <div className="group-611">
                <h1 className="title-back-login">Back to login</h1>
                <div className="overlap-group-111" onClick={toggleForm}>
                  <div className="login-1-btn">Login</div>
                </div>
              </div>
            </div>
            <div className="center-line">
              <img className="line-2" src={Line} />
            </div>
            <div className="right-side">
              <div className="this-is-your-first-visit">Registration</div>
              <div className="group-61">
                <div className="username">Email</div>
                <div className="register-input">
                  <input
                    type="email"
                    className="username-1"
                    placeholder="Email"
                    name="email"
                    value={formRegister.email}
                    onChange={changeHandlerRegister}
                    required
                  ></input>
                </div>
              </div>
              <div className="group-61">
                <div className="username">Password</div>
                <div className="register-input">
                  <input
                    type="password"
                    className="username-1"
                    placeholder="Password"
                    name="password"
                    value={formRegister.password}
                    onChange={changeHandlerRegister}
                    required
                  ></input>
                </div>
              </div>
              <div className="group-61">
                <div className="username">Repeat password</div>
                <div className="register-input">
                  <input
                    type="password"
                    className="username-1"
                    placeholder="Repeat password"
                    name="passwordConfirmation"
                    value={formRegister.passwordConfirmation}
                    onChange={changeHandlerRegister}
                    required
                  ></input>
                </div>
              </div>
              <div className="group-61">
                <button
                  type="submit"
                  className="overlap-group-5"
                  onClick={registerHandler}
                  disabled={loading}
                >
                  <div className="place">Register</div>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Auth;
