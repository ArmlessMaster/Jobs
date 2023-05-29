import "./priceTable.scss";
import { Footer, Header } from "../../layout";
import { React, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Line from "../../../images/svgcomponents/Line 2.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PriceTable = () => {
  const history = useNavigate();
  const [priceTop, setPriceTop] = useState(100);
  const [price, setPrice] = useState(15);
  const [days, setDays] = useState(30);

  const handleChangeWithTop = async (e) => {
    localStorage.setItem("createJob", JSON.stringify({price: priceTop, isTop: true, days: days}));
    history("/joboffer");
  };

  const handleChangeWithoutTop = async (e) => {
    localStorage.setItem("createJob", JSON.stringify({price: price, isTop: false,  days: days}));
    history("/joboffer");
  };

  return (
    <div class="posting-details">
      <div class="content-container">
        <h2 class="h2">Get a job live in no time</h2>
        <div class="how-to-container">
          <div class="how-to-card">
            <div class="indicator-container">
              <div class="indicator-text">1</div>
            </div>
            <div class="how-to-card-text-container">
              <h4 class="h3">Choose a plan</h4>
              <div class="card-text">Choose the plan that is right for your needs, budget and timeline.</div>
            </div>
          </div>
          <div class="how-to-card">
            <div class="indicator-container">
              <div class="indicator-text">2</div>
            </div>
            <div class="how-to-card-text-container">
              <h4 class="h3">Add the details</h4>
              <div class="card-text">Fill out the form with all relevant job details so we can list your job ASAP.</div>
            </div>
          </div>
          <div class="how-to-card">
            <div class="indicator-container">
              <div class="indicator-text">3</div>
            </div>
            <div class="how-to-card-text-container">
              <h4 class="h3">Pay &amp; submit</h4>
              <div class="card-text">Complete the payment and submit the job for us to review and list.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="pricing-wrapper">
      <div className="pricing-card-container">
        <div class="pricing-card">
          <div class="pricing-card-head-container">
            <h2 class="h2">Basic</h2>
            <div class="pricing-card-description">The standard job post that takes care of everything.</div>
          </div>
          <div class="pricing-card-price-container">
            <div class="price">
              <span class="text-span-2">29,99$</span> {price}$</div>
            <div class="job-card-description">Per job &amp; month</div>
          </div>
          <div class="pricing-card-benefits-container">
            <div class="pricing-card-benefit-container">
              <img className="image-checkbox" src="https://uploads-ssl.webflow.com/63edf53095958d325de5f74a/63ef41c6abe869201175c89d_tickcircle.svg" loading="lazy" width="24" height="24" alt="" />
              <div className="pricing-card-benefit">{days} day listing</div>
            </div>
            <div class="pricing-card-benefit-container">
              <img className="image-checkbox" src="https://uploads-ssl.webflow.com/63edf53095958d325de5f74a/63ef41c6abe869201175c89d_tickcircle.svg" loading="lazy" width="24" height="24" alt="" />
              <div className="pricing-card-benefit">Shared in weekly newsletter</div>
            </div>
          </div>
          <div className="pricing-button">
            <a target="_blank" class="primary-button-large" onClick={handleChangeWithoutTop}>Post a job</a>
          </div>
        </div>
        <div class="pricing-card">
          <div class="pricing-card-head-container">
            <h2 class="h2">Basic + TOP</h2>
            <div class="pricing-card-description">The standard job post that takes care of everything.</div>
          </div>
          <div class="pricing-card-price-container">
            <div class="price">
              {priceTop}€</div>
            <div class="job-card-description">Per job &amp; month</div>
          </div>
          <div class="pricing-card-benefits-container">
            <div class="pricing-card-benefit-container">
              <img className="image-checkbox" src="https://uploads-ssl.webflow.com/63edf53095958d325de5f74a/63ef41c6abe869201175c89d_tickcircle.svg" loading="lazy" width="24" height="24" alt="" />
              <div class="pricing-card-benefit">{days} day listing</div>
            </div>
            <div class="pricing-card-benefit-container">
              <img className="image-checkbox" src="https://uploads-ssl.webflow.com/63edf53095958d325de5f74a/63ef41c6abe869201175c89d_tickcircle.svg" loading="lazy" width="24" height="24" alt="" />
              <div class="pricing-card-benefit">Shared in weekly newsletter</div>
            </div>
            <div class="pricing-card-benefit-container">
              <img className="image-checkbox" src="https://uploads-ssl.webflow.com/63edf53095958d325de5f74a/63ef41c6abe869201175c89d_tickcircle.svg" loading="lazy" width="24" height="24" alt="" />
              <div class="pricing-card-benefit">Pinned to the top of the board</div>
            </div>
          </div>
          <div className="pricing-button">
            <a target="_blank" class="primary-button-large" onClick={handleChangeWithTop}>Post a job</a>
          </div>
        </div>
      </div>
      </div>
      
    </div>
  );
};

export default PriceTable;
