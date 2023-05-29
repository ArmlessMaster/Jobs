import "./Header.scss";
import { React, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";

const Header = () => {

  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();

  const handleLogout = async () => {
    try {
      await request("/api/user/logout", "POST");
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };


  return (

    <header className="header">
      <div className="container-header">
        <div className="header-content">
          <div className="left-side-header">
            <NavLink to="/main" className="logo">
              <div className="rectangle"></div>
              <div className="ehor-jobs">EhorJobs</div>
            </NavLink>
          </div>
          <div className="right-side-header">
            {/* <div className="menu-ul">
              <div className="menu-ul-item">Home</div>
              <div className="menu-ul-item">About</div>
              <div className="menu-ul-item">Jobs</div>
              <div className="menu-ul-item">Contact</div>
            </div> */}
            <div className="button-menu">
              {auth.accessToken ? <div className="overlap-group-3" onClick={handleLogout} disabled={loading}><a className="login">Logout</a></div> : <NavLink to="/auth" className="overlap-group-3">
              <a className="login">Login</a>
              </NavLink>}
              <NavLink to={auth.accessToken ? "/price" : "/auth"} className="overlap-group1">
                <a  className="post-a-job">Post a Job</a>
              </NavLink>
            </div>
          </div>
        </div>
      </div>



      {/* // Выбор языка */}
      {/* <div className="language">
      <div className="eng nunito-semi-bold-gravel-20px">Eng</div>
      <button><img></img></button>
    </div> */}
      {/* <div className="overlap-group7">
        <div className="overlap-group1-1">
          <div className="decor">
            <div className="flex-row-1">
              <div className="rectangle-36"></div>
              <div className="rectangle-34"></div>
              <div className="rectangle-35"></div>
            </div>
            <img className="vector-1" src="vector-1-1.svg" alt="Vector 1" />
          </div>
          <div className="image-container">
            <img className="image-1" src="image-1.png" alt="image 1" />
            <img
              className="image-2"
              src="image-2.png"
              alt="image 2"
            />
            <img className="image-3" src=" 'image-3.png" alt="image 3" />
          </div>
          <div className="photo">
            <img className="image-4" src="image-4.png" alt="image 4" />
            <div className="find-your-success nunito-bold-black-16px">Find your success</div>
            <p className="our-motto-is-to-help-everyone">our motto is "to help everyone"</p>
          </div>
        </div>
        <div className="overlap-group3">
          <div className="tap-see-popular-variants nunito-bold-black-16px">TAP SEE <br />POPULAR<br />VARIANTS</div>
        </div>
        <div className="popular-categories">*/}
    </header>
  )
}

export default Header;