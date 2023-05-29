import "./Footer.scss";
import { React, useState, useEffect } from "react";

const client = require("@mailchimp/mailchimp_marketing")
const API_KEY = "9cd8e709a628b41ec24c9af95562acf0-us21"
const SERVER_PREFIX = "us21"

client.setConfig({
  apiKey: API_KEY,
  server: SERVER_PREFIX,
});

const Footer = () => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };
  function handleSubscribe(req, res) {
    const { userEmail } = req.query

    client.lists.addListMember("c168f6dfc8", {
      email_address: userEmail,
      status: "subscribed",
    }).then(resp => {
      console.log(resp)
      res.status("200").json({status: "subscribed"})
    }).catch(err => console.error(err))
  };

  return (
    <>
      {visible && (
        <div class="footer">
          <form className="footer-wrapper" component={"form"} onSubmit={handleSubscribe}>
            <p className="newsletter">Sign up for our newsletter</p>
            <input type="email" className="email-address" placeholder="example@gmail.com" id="userEmail" ></input>
            <button type="submit" className="footer-button">Subscribe</button>
            <svg onClick={handleClose} className="close-button" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 492 492">
              <g>
                <g>
                  <path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872
			c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872
			c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052
			L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116
			c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952
			c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116
			c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z"/>
                </g>
              </g>
            </svg>
          </form>
        </div>
      )}
    </>
  )
}

export default Footer;