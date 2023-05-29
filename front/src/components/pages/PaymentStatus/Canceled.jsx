import { React } from "react";
import { useNavigate } from "react-router-dom";
import ababa from '../../../images/decor/canceled.png'

import "./Status.scss";

const Canceled = () => {
  const history = useNavigate();
  localStorage.removeItem("job")
  localStorage.removeItem("top")
  localStorage.removeItem("image")
  localStorage.removeItem("renewal")
  localStorage.removeItem("createJob")
  const canceledHandler = () => {
    history("/main");
  };

  return (
    <div class="page-wrapper">
      <div class="custom-modal">
        <img src={ababa} class="danger danger-animation icon-top"></img>
        <div class="danger border-bottom"></div>
        <div class="content">
          <div className="text-content">
            <p class="message-type-error">Error</p>
            <p class="message-type">TryAgain</p>
          </div>
          <button onClick={canceledHandler} class="button-box-red"><p class="green">Continue</p></button>
        </div>
      </div>
    </div>
  );
};

export default Canceled;