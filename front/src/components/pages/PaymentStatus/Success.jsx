import React, { useCallback, useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import ababa from "../../../images/decor/checked.png";
import ababa123 from '../../../images/decor/canceled.png'
import "./Status.scss";

const Success = () => {
  const history = useNavigate();
  const { loading, request } = useHttp();
  const { time, days, key } = useParams();
  const timeNow = new Date().getTime();
  const auth = useContext(AuthContext);
  const [hasLoaded, setHasLoaded] = useState(true);
  const [success, setSuccess] = useState(true);

  function urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }

  const fetchAccount = useCallback(async () => {
    try {
      setHasLoaded(false);
      if (
        time &&
        key &&
        (key.length === 100) & (timeNow - time < 3600000) &&
        days < 366
      ) {
        await request("/api/user/me", "GET", null, null, {
          Authorization: `Bearer ${auth.accessToken}`,
        }).then(async (res) => {
          const paymentKeys = res.user.paymentKeys;
          const allPaymentKeys = res.user.allPaymentKeys;
          if (!paymentKeys.includes(key) && allPaymentKeys.includes(key)) {
            const form = JSON.parse(localStorage.getItem("job"));
            const image = JSON.parse(localStorage.getItem("image"));
            const top = JSON.parse(localStorage.getItem("top"));
            const renewal = JSON.parse(localStorage.getItem("renewal"));
            if (top) {
              await request(
                "/api/job/top",
                "PUT",
                { _id: top, days, key },
                null,
                {
                  Authorization: `Bearer ${auth.accessToken}`,
                }
              );
              localStorage.removeItem("top");
              setHasLoaded(true);
            } else if (renewal) {
              await request(
                "/api/job/renewal",
                "PUT",
                { _id: renewal, days, key },
                null,
                {
                  Authorization: `Bearer ${auth.accessToken}`,
                }
              );
              localStorage.removeItem("renewal");
              setHasLoaded(true);
            } else if (image) {
              urltoFile(image.file, image.name, image.type).then(
                async function (image) {
                  const myArray = [];
                  myArray.push(image);
                  await request(
                    "/api/job/create",
                    "POST",
                    { ...form, key },
                    myArray,
                    {
                      Authorization: `Bearer ${auth.accessToken}`,
                    }
                  );
                  localStorage.removeItem("job");
                  localStorage.removeItem("image");
                  localStorage.removeItem("createJob")
                  setHasLoaded(true);
                }
              );
            } else {
              await request("/api/job/create", "POST", { ...form, key }, null, {
                Authorization: `Bearer ${auth.accessToken}`,
              });
              localStorage.removeItem("job");
              localStorage.removeItem("image");
              localStorage.removeItem("createJob")
              setHasLoaded(true);
            }
          } else {
            setHasLoaded(true);
            setSuccess(false);
          }
        });
      } else {
        setHasLoaded(true);
        setSuccess(false);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const successHandler = () => {
    history("/main");
  };

  return hasLoaded && success ? (
    <div class="page-wrapper">
      <div class="custom-modal">
        <img src={ababa} class="succes succes-animation icon-top"></img>
        <div class="succes border-bottom"></div>
        <div class="content">
          <div className="text-content">
            <p class="message-type-success">Success</p>
            <p class="message-type">Good Job!</p>
          </div>
          <button onClick={successHandler} class="button-box-green">
            <p class="red">Continue</p>
          </button>
        </div>
      </div>
    </div>
  ) : hasLoaded && !success ? (
    <div class="page-wrapper">
      <div class="custom-modal">
        <img src={ababa123} class="danger danger-animation icon-top"></img>
        <div class="danger border-bottom"></div>
        <div class="content">
          <div className="text-content">
            <p class="message-type-error">Error</p>
            <p class="message-type">TryAgain</p>
          </div>
          <button onClick={successHandler} class="button-box-red">
            <p class="green">Continue</p>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default Success;