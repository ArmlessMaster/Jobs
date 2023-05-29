import "./jobOffer.scss";
import Select from "react-select";
import { React, useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobOffer = () => {
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const [preview, setPreview] = useState([]);
  const [images, setImages] = useState([]);
  const ababa = JSON.parse(localStorage.getItem("job"));
  const ababa123 = JSON.parse(localStorage.getItem("createJob"));
  localStorage.removeItem("top");
  localStorage.removeItem("renewal");

  useEffect(() => {
    localStorage.removeItem("image");
  }, []);
  
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid rgba(0, 0, 0, 0.3)",
      borderRadius: "8px",
      width: "100%",
      paddingLeft: "0px",
      outline: "none",
      "&:hover": {
        border: "1px solid rgba(0, 0, 0, 0.3)",
      },
    }),
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike", "blickquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const [formJob, setFormJob] = useState(
    ababa || {
      title: "",
      company: "",
      type: "💻Contract",
      location: [],
      phone: "",
      priceFrom: null,
      priceTo: null,
      link: "",
      experience: [],
      about: "",
      requirements: "",
      days: 30,
      topDays: 30,
      isTop: ababa123 ? ababa123.isTop : false,
    }
  );

  const [formJobImage, setFormJobImage] = useState("");

  const experienceOptions = [
    { value: "🤓 Engineer", label: "🤓 Engineer" },
    { value: "💼 Executive", label: "💼 Executive" },
    { value: "👵 Senior", label: "👵 Senior" },
    { value: "🤓 Developer", label: "🤓 Developer" },
    { value: "💰 Finance", label: "💰 Finance" },
    { value: "♾️ Sys Admin", label: "♾️ Sys Admin" },
    { value: "☕️ JavaScript", label: "☕️ JavaScript" },
    { value: "🍑 Backend", label: "🍑 Backend" },
    { value: "🐀 Golang", label: "🐀 Golang" },
    { value: "☁️ Cloud", label: "☁️ Cloud" },
    { value: "🚑 Medica", label: "🚑 Medica" },
    { value: "🎨 Front End", label: "🎨 Front End" },
    { value: "🥞 Full Stack", label: "🥞 Full Stack" },
    { value: "♾️ Ops", label: "♾️ Ops" },
    { value: "🎨 Design", label: "🎨 Design" },
    { value: "⚛️ React", label: "⚛️ React" },
    { value: "🔑 InfoSec", label: "🔑 InfoSec" },
    { value: "🚥 Marketing", label: "🚥 Marketing" },
    { value: "📱 Mobile", label: "📱 Mobile" },
    { value: "✍️ Content Writing", label: "✍️ Content Writing" },
    { value: "📦 SaaS", label: "📦 SaaS" },
    { value: "🤖 API", label: "🤖 API" },
    { value: "💼 Sales", label: "💼 Sales" },
    { value: "💎 Ruby", label: "💎 Ruby" },
    { value: "👨‍🏫 Education", label: "👨‍🏫 Education" },
    { value: "♾️ DevOps", label: "♾️ DevOps" },
    { value: "👩‍🔬 Stats", label: "👩‍🔬 Stats" },
    { value: "🐍 Python", label: "🐍 Python" },
    { value: "🔗 Node", label: "🔗 Node" },
    { value: "🇬🇧 English", label: "🇬🇧 English" },
    { value: "🔌 Non Tech", label: "🔌 Non Tech" },
    { value: "📼 Video", label: "📼 Video" },
    { value: "🎒 Travel", label: "🎒 Travel" },
    { value: "🔬 Quality Assurance", label: "🔬 Quality Assurance" },
    { value: "🛍 Ecommerce", label: "🛍 Ecommerce" },
    { value: "👨‍🏫 Teaching", label: "👨‍🏫 Teaching" },
    { value: "🐧 Linux", label: "🐧 Linux" },
    { value: "☕️ Java", label: "☕️ Java" },
    { value: "🏅 Crypto", label: "🏅 Crypto" },
    { value: "👶 Junior", label: "👶 Junior" },
    { value: "📦 Git", label: "📦 Git" },
    { value: "👩‍⚖️ Legal", label: "👩‍⚖️ Legal" },
    { value: "🤖 Android", label: "🤖 Android" },
    { value: "💼 Accounting", label: "💼 Accounting" },
    { value: "♾️ Admin", label: "♾️ Admin" },
    { value: "🖼 Microsoft", label: "🖼 Microsoft" },
    { value: "📗 Excel", label: "📗 Excel" },
    { value: "🐘 PHP ", label: "🐘 PHP " },
    { value: "☁️ Amazon", label: "☁️ Amazon" },
    { value: "☁️ Serverless", label: "☁️ Serverless" },
    { value: "🎨 CSS", label: "🎨 CSS" },
    { value: "🤓 Software", label: "🤓 Software" },
    { value: "🤔 Analyst", label: "🤔 Analyst" },
    { value: "🅰️ Angular", label: "🅰️ Angular" },
    { value: "🍏 iOS", label: "🍏 iOS" },
    { value: "🎧 Customer Support", label: "🎧 Customer Support" },
    { value: "🔡 HTML", label: "🔡 HTML" },
    { value: "☁️ Salesforce", label: "☁️ Salesforce" },
    { value: "🚥 Ads", label: "🚥 Ads" },
    { value: "📦 Product Designer", label: "📦 Product Designer" },
    { value: "👋 HR", label: "👋 HR" },
    { value: "🐬 SQL", label: "🐬 SQL" },
    { value: "🔷 C", label: "🔷 C" },
    { value: "🤓 Web Developer", label: "🤓 Web Developer" },
    { value: "🚫 NoSQL", label: "🚫 NoSQL" },
    { value: "🐬 Postgres", label: "🐬 Postgres" },
    { value: "➕ C++", label: "➕ C++" },
    { value: "🔷 Jira", label: "🔷 Jira" },
    { value: "#️⃣ C#", label: "#️⃣ C#" },
    { value: "🔎 SEO", label: "🔎 SEO" },
    { value: "🚁 Apache", label: "🚁 Apache" },
    { value: "👩‍🔬 Data Science", label: "👩‍🔬 Data Science" },
    { value: "🎧 Virtual Assistant", label: "🎧 Virtual Assistant" },
    { value: "⚛️ React Native", label: "⚛️ React Native" },
    { value: "🍃 Mongo", label: "🍃 Mongo" },
    { value: "🧪 Testing", label: "🧪 Testing" },
    { value: "📦 Architecture", label: "📦 Architecture" },
    { value: "🔷 Director", label: "🔷 Director" },
    { value: "🎵 Music", label: "🎵 Music" },
    { value: "🛍 Shopify", label: "🛍 Shopify" },
    { value: "✍️ Wordpress", label: "✍️ Wordpress" },
    { value: "📦 Laravel", label: "📦 Laravel" },
    { value: "🧩 Elasticsearch", label: "🧩 Elasticsearch" },
    { value: "⛓ Blockchain", label: "⛓ Blockchain" },
    { value: "💎 Web3", label: "💎 Web3" },
    { value: "💧 Drupal", label: "💧 Drupal" },
    { value: "🐳 Docker", label: "🐳 Docker" },
    { value: "⚛️ GraphQL", label: "⚛️ GraphQL" },
    { value: "💼 Payroll", label: "💼 Payroll" },
    { value: "👩‍🎓 Internship", label: "👩‍🎓 Internship" },
    { value: "🤖 Machine Learning", label: "🤖 Machine Learning" },
    { value: "📦 Architect", label: "📦 Architect" },
    { value: "☕️ Scala", label: "☕️ Scala" },
    { value: "🎨 Web", label: "🎨 Web" },
    { value: "🍏 Objective C", label: "🍏 Objective C" },
    { value: "✍️ Social Media", label: "✍️ Social Media" },
    { value: "💚 Vue", label: "💚 Vue" },
  ];
  const locationOptions = [
    {
      label: "Regions",
      options: [
        { value: "🌏 Worldwide", label: "🌏 Worldwide" },
        { value: "⛰️ North America", label: "⛰️ North America" },
        { value: "💃 Latin America", label: "💃 Latin America" },
        { value: "🇪🇺 Europe", label: "🇪🇺 Europe" },
        { value: "🦁 Africa", label: "🦁 Africa" },
        { value: "🕌 Middle East", label: "🕌 Middle East" },
        { value: "⛩ Asia", label: "⛩ Asia" },
        { value: "🌊 Oceania", label: "🌊 Oceania" },
      ],
    },
    {
      label: "Countries",
      options: [
        { value: "🇺🇸 United States", label: "🇺🇸 United States" },
        { value: "🇨🇦 Canada", label: "🇨🇦 Canada" },
        { value: "🇬🇧 United Kingdom", label: "🇬🇧 United Kingdom" },
        { value: "🇦🇺 Australia", label: "🇦🇺 Australia" },
        { value: "🇳🇿 New Zealand", label: "🇳🇿 New Zealand" },
        { value: "🇮🇳 India", label: "🇮🇳 India" },
        { value: "🇵🇹 Portugal", label: "🇵🇹 Portugal" },
        { value: "🇩🇪 Germany", label: "🇩🇪 Germany" },
        { value: "🇳🇱 Netherlands", label: "🇳🇱 Netherlands" },
        { value: "🇸🇬 Singapore", label: "🇸🇬 Singapore" },
        { value: "🇫🇷 France ", label: "🇫🇷 France " },
        { value: "🇭🇰 Hong Kong", label: "🇭🇰 Hong Kong" },
        { value: "🇧🇷 Brazil", label: "🇧🇷 Brazil" },
        { value: "🇬🇷 Greece", label: "🇬🇷 Greece" },
        { value: "🇦🇪 United Arab Emirates", label: "🇦🇪 United Arab Emirates" },
        { value: "🇸🇪 Sweden", label: "🇸🇪 Sweden" },
        { value: "🇵🇱 Poland", label: "🇵🇱 Poland" },
        { value: "🇪🇸 Spain", label: "🇪🇸 Spain" },
        { value: "🇲🇽 Mexico", label: "🇲🇽 Mexico" },
        { value: "🇺🇦 Ukraine", label: "🇺🇦 Ukraine" },
        { value: "🇯🇵 Japan", label: "🇯🇵 Japan" },
        { value: "🇹🇭 Thailand", label: "🇹🇭 Thailand" },
        { value: "🇨🇿 Czechia", label: "🇨🇿 Czechia" },
        { value: "🇷🇺 Russia", label: "🇷🇺 Russia" },
        { value: "🇮🇱 Israel", label: "🇮🇱 Israel" },
        { value: "🇫🇮 Finland", label: "🇫🇮 Finland" },
        { value: "🇨🇳 China", label: "🇨🇳 China" },
        { value: "🇮🇩 Indonesia", label: "🇮🇩 Indonesia" },
        { value: "🇦🇫 Afghanistan", label: "🇦🇫 Afghanistan" },
        { value: "🇦🇱 Albania", label: "🇦🇱 Albania" },
        { value: "🇩🇿 Algeria", label: "🇩🇿 Algeria" },
        { value: "🇦🇸 American Samoa", label: "🇦🇸 American Samoa" },
        { value: "🇦🇩 Andorra", label: "🇦🇩 Andorra" },
        { value: "🇦🇴 Angola", label: "🇦🇴 Angola" },
        { value: "🇦🇮 Anguilla", label: "🇦🇮 Anguilla" },
        { value: "🇦🇶 Antarctica", label: "🇦🇶 Antarctica" },
        { value: "🇦🇬 Antigua and Barbuda", label: "🇦🇬 Antigua and Barbuda" },
        { value: "🇦🇷 Argentina", label: "🇦🇷 Argentina" },
        { value: "🇦🇲 Armenia", label: "🇦🇲 Armenia" },
        { value: "🇦🇼 Aruba", label: "🇦🇼 Aruba" },
        { value: "🇦🇹 Austria", label: "🇦🇹 Austria" },
        { value: "🇦🇿 Azerbaijan", label: "🇦🇿 Azerbaijan" },
        { value: "🇧🇭 Bahrain", label: "🇧🇭 Bahrain" },
        { value: "🇧🇩 Bangladesh", label: "🇧🇩 Bangladesh" },
        { value: "🇧🇧 Barbados", label: "🇧🇧 Barbados" },
        { value: "🇧🇾 Belarus", label: "🇧🇾 Belarus" },
        { value: "🇧🇪 Belgium", label: "🇧🇪 Belgium" },
        { value: "🇧🇿 Belize", label: "🇧🇿 Belize" },
        { value: "🇧🇯 Benin", label: "🇧🇯 Benin" },
        { value: "🇧🇲 Bermuda", label: "🇧🇲 Bermuda" },
        { value: "🇧🇹 Bhutan", label: "🇧🇹 Bhutan" },
        { value: "🇧🇴 Bolivia", label: "🇧🇴 Bolivia" },
        { value: "🇧🇦 Bosnia", label: "🇧🇦 Bosnia" },
        { value: "🇧🇼 Botswana", label: "🇧🇼 Botswana" },
        { value: "🇧🇻 Bouvet Island", label: "🇧🇻 Bouvet Island" },
        {
          value: "🇮🇴 British Indian Ocean Territory",
          label: "🇮🇴 British Indian Ocean Territory",
        },
        { value: "🇧🇳 Brunei", label: "🇧🇳 Brunei" },
        { value: "🇧🇬 Bulgaria", label: "🇧🇬 Bulgaria" },
        { value: "🇧🇫 Burkina Faso", label: "🇧🇫 Burkina Faso" },
        { value: "🇧🇮 Burundi", label: "🇧🇮 Burundi" },
        { value: "🇰🇭 Cambodia", label: "🇰🇭 Cambodia" },
        { value: "🇨🇲 Cameroon", label: "🇨🇲 Cameroon" },
        { value: "🇨🇻 Cape Verde", label: "🇨🇻 Cape Verde" },
        { value: "🇰🇾 Cayman Islands", label: "🇰🇾 Cayman Islands" },
        {
          value: "🇨🇫 Central African Republic",
          label: "🇨🇫 Central African Republic",
        },
        { value: "🇹🇩 Chad", label: "🇹🇩 Chad" },
        { value: "🇨🇱 Chile", label: "🇨🇱 Chile" },
        { value: "🇨🇽 Christmas Island", label: "🇨🇽 Christmas Island" },
        { value: "🇨🇨 Cocos Islands", label: "🇨🇨 Cocos Islands" },
        { value: "🇨🇴 Colombia", label: "🇨🇴 Colombia" },
        { value: "🇰🇲 Comoros", label: "🇰🇲 Comoros" },
        { value: "🇨🇬 Congo", label: "🇨🇬 Congo" },
        { value: "🇨🇩 DR Congo", label: "🇨🇩 DR Congo" },
        { value: "🇨🇰 Cook Islands", label: "🇨🇰 Cook Islands" },
        { value: "🇨🇷 Costa Rica", label: "🇨🇷 Costa Rica" },
        { value: "🇭🇷 Croatia", label: "🇭🇷 Croatia" },
        { value: "🇨🇺 Cuba", label: "🇨🇺 Cuba" },
        { value: "🇨🇼 Curaçao", label: "🇨🇼 Curaçao" },
        { value: "🇨🇾 Cyprus", label: "🇨🇾 Cyprus" },
        { value: "🇩🇰 Denmark", label: "🇩🇰 Denmark" },
        { value: "🇩🇯 Djibouti", label: "🇩🇯 Djibouti" },
        { value: "🇩🇲 Dominica", label: "🇩🇲 Dominica" },
        { value: "🇩🇴 Dominican Republic", label: "🇩🇴 Dominican Republic" },
        { value: "🇪🇨 Ecuador", label: "🇪🇨 Ecuador" },
        { value: "🇪🇬 Egypt", label: "🇪🇬 Egypt" },
        { value: "🇸🇻 El Salvador", label: "🇸🇻 El Salvador" },
        { value: "🇬🇶 Equatorial Guinea", label: "🇬🇶 Equatorial Guinea" },
        { value: "🇪🇷 Eritrea", label: "🇪🇷 Eritrea" },
        { value: "🇪🇪 Estonia", label: "🇪🇪 Estonia" },
        { value: "🇪🇹 Ethiopia", label: "🇪🇹 Ethiopia" },
        { value: "🇫🇰 Falkland Islands", label: "🇫🇰 Falkland Islands" },
        { value: "🇫🇴 Faroe Islands", label: "🇫🇴 Faroe Islands" },
        { value: "🇫🇯 Fiji", label: "🇫🇯 Fiji" },
        { value: "🇬🇫 French Guiana", label: "🇬🇫 French Guiana" },
        { value: "🇹🇱 East Timor", label: "🇹🇱 East Timor" },
        {
          value: "🇹🇫 French Southern Territories",
          label: "🇹🇫 French Southern Territories",
        },
        { value: "🇬🇦 Gabon", label: "🇬🇦 Gabon" },
        { value: "🇬🇲 Gambia", label: "🇬🇲 Gambia" },
        { value: "🇬🇪 Georgia", label: "🇬🇪 Georgia" },
        { value: "🇬🇭 Ghana", label: "🇬🇭 Ghana" },
        { value: "🇬🇮 Gibraltar", label: "🇬🇮 Gibraltar" },
        { value: "🇬🇱 Greenland", label: "🇬🇱 Greenland" },
        { value: "🇬🇩 Grenada", label: "🇬🇩 Grenada" },
        { value: "🇬🇵 Guadeloupe", label: "🇬🇵 Guadeloupe" },
        { value: "🇬🇺 Guam", label: "🇬🇺 Guam" },
        { value: "🇬🇹 Guatemala", label: "🇬🇹 Guatemala" },
        { value: "🇬🇬 Guernsey", label: "🇬🇬 Guernsey" },
        { value: "🇬🇳 Guinea", label: "🇬🇳 Guinea" },
        { value: "🇬🇼 Guinea Bissau", label: "🇬🇼 Guinea Bissau" },
        { value: "🇬🇾 Guyana", label: "🇬🇾 Guyana" },
        { value: "🇭🇹 Haiti", label: "🇭🇹 Haiti" },
        {
          value: "🇭🇲 Heard Island and McDonald Islands",
          label: "🇭🇲 Heard Island and McDonald Islands",
        },
        { value: "🇭🇳 Honduras", label: "🇭🇳 Honduras" },
        { value: "🇭🇺 Hungary", label: "🇭🇺 Hungary" },
        { value: "🇮🇸 Iceland", label: "🇮🇸 Iceland" },
        { value: "🇮🇷 Iran", label: "🇮🇷 Iran" },
        { value: "🇮🇶 Iraq", label: "🇮🇶 Iraq" },
        { value: "🇮🇪 Ireland", label: "🇮🇪 Ireland" },
        { value: "🇮🇲 Isle of Man", label: "🇮🇲 Isle of Man" },
        { value: "🇮🇹 Italy", label: "🇮🇹 Italy" },
        { value: "🇨🇮 Cote d'Ivoire", label: "🇨🇮 Cote d'Ivoire" },
        { value: "🇯🇲 Jamaica", label: "🇯🇲 Jamaica" },
        { value: "🇯🇪 Jersey", label: "🇯🇪 Jersey" },
        { value: "🇯🇴 Jordan", label: "🇯🇴 Jordan" },
        { value: "🇽🇰 Kosovo", label: "🇽🇰 Kosovo" },
        { value: "🇰🇿 Kazakhstan", label: "🇰🇿 Kazakhstan" },
        { value: "🇰🇪 Kenya", label: "🇰🇪 Kenya" },
        { value: "🇰🇮 Kiribati", label: "🇰🇮 Kiribati" },
        { value: "🇰🇵 North Korea", label: "🇰🇵 North Korea" },
        { value: "🇰🇷 South Korea", label: "🇰🇷 South Korea" },
        { value: "🏴 Kurdistan", label: "🏴 Kurdistan" },
        { value: "🇰🇼 Kuwait", label: "🇰🇼 Kuwait" },
        { value: "🇰🇬 Kyrgyzstan", label: "🇰🇬 Kyrgyzstan" },
        { value: "🇱🇦 Laos", label: "🇱🇦 Laos" },
        { value: "🇱🇻 Latvia", label: "🇱🇻 Latvia" },
        { value: "🇱🇧 Lebanon", label: "🇱🇧 Lebanon" },
        { value: "🇱🇸 Lesotho", label: "🇱🇸 Lesotho" },
        { value: "🇱🇷 Liberia", label: "🇱🇷 Liberia" },
        { value: "🇱🇾 Libya", label: "🇱🇾 Libya" },
        { value: "🇱🇮 Liechtenstein", label: "🇱🇮 Liechtenstein" },
        { value: "🇱🇹 Lithuania", label: "🇱🇹 Lithuania" },
        { value: "🇱🇺 Luxembourg", label: "🇱🇺 Luxembourg" },
        { value: "🇲🇴 Macau", label: "🇲🇴 Macau" },
        { value: "🇲🇰 North Macedonia", label: "🇲🇰 North Macedonia" },
        { value: "🇲🇬 Madagascar", label: "🇲🇬 Madagascar" },
        { value: "🇲🇼 Malawi", label: "🇲🇼 Malawi" },
        { value: "🇲🇾 Malaysia", label: "🇲🇾 Malaysia" },
        { value: "🇲🇻 Maldives", label: "🇲🇻 Maldives" },
        { value: "🇲🇱 Mali", label: "🇲🇱 Mali" },
        { value: "🇲🇹 Malta", label: "🇲🇹 Malta" },
        { value: "🇲🇭 Marshall Islands", label: "🇲🇭 Marshall Islands" },
        { value: "🇲🇶 Martinique", label: "🇲🇶 Martinique" },
        { value: "🇲🇷 Mauritania", label: "🇲🇷 Mauritania" },
        { value: "🇲🇺 Mauritius", label: "🇲🇺 Mauritius" },
        { value: "🇾🇹 Mayotte", label: "🇾🇹 Mayotte" },
        { value: "🇫🇲 Micronesia", label: "🇫🇲 Micronesia" },
        { value: "🇲🇩 Moldova", label: "🇲🇩 Moldova" },
        { value: "🇲🇨 Monaco", label: "🇲🇨 Monaco" },
        { value: "🇲🇳 Mongolia", label: "🇲🇳 Mongolia" },
        { value: "🇲🇪 Montenegro", label: "🇲🇪 Montenegro" },
        { value: "🇲🇸 Montserrat", label: "🇲🇸 Montserrat" },
        { value: "🇲🇦 Morocco", label: "🇲🇦 Morocco" },
        { value: "🇲🇿 Mozambique", label: "🇲🇿 Mozambique" },
        { value: "🇲🇲 Myanmar", label: "🇲🇲 Myanmar" },
        { value: "🇳🇦 Namibia", label: "🇳🇦 Namibia" },
        { value: "🇳🇷 Nauru", label: "🇳🇷 Nauru" },
        { value: "🇳🇵 Nepal", label: "🇳🇵 Nepal" },
        {
          value: "🇧🇶 Caribbean Netherlands",
          label: "🇧🇶 Caribbean Netherlands",
        },
        { value: "🇳🇨 New Caledonia", label: "🇳🇨 New Caledonia" },
        { value: "🇳🇮 Nicaragua", label: "🇳🇮 Nicaragua" },
        { value: "🇳🇪 Niger", label: "🇳🇪 Niger" },
        { value: "🇳🇬 Nigeria", label: "🇳🇬 Nigeria" },
        { value: "🇳🇺 Niue", label: "🇳🇺 Niue" },
        { value: "🇳🇫 Norfolk Island", label: "🇳🇫 Norfolk Island" },
        {
          value: "🇲🇵 Northern Mariana Islands",
          label: "🇲🇵 Northern Mariana Islands",
        },
        { value: "🇳🇴 Norway", label: "🇳🇴 Norway" },
        { value: "🇴🇲 Oman", label: "🇴🇲 Oman" },
        { value: "🇵🇸 Palestine", label: "🇵🇸 Palestine" },
        { value: "🇵🇰 Pakistan", label: "🇵🇰 Pakistan" },
        { value: "🇵🇼 Palau", label: "🇵🇼 Palau" },
        { value: "🇵🇦 Panama", label: "🇵🇦 Panama" },
        { value: "🇵🇬 Papua New Guinea", label: "🇵🇬 Papua New Guinea" },
        { value: "🇵🇾 Paraguay", label: "🇵🇾 Paraguay" },
        { value: "🇵🇪 Peru", label: "🇵🇪 Peru" },
        { value: "🇵🇭 Philippines", label: "🇵🇭 Philippines" },
        { value: "🇵🇳 Pitcairn Island", label: "🇵🇳 Pitcairn Island" },
        { value: "🇵🇫 Polynesia", label: "🇵🇫 Polynesia" },
        { value: "🇵🇷 Puerto Rico", label: "🇵🇷 Puerto Rico" },
        { value: "🇶🇦 Qatar", label: "🇶🇦 Qatar" },
        { value: "🇷🇪 Reunion", label: "🇷🇪 Reunion" },
        { value: "🇷🇴 Romania", label: "🇷🇴 Romania" },
        { value: "🇷🇼 Rwanda", label: "🇷🇼 Rwanda" },
        { value: "🇸🇭 Saint Helena", label: "🇸🇭 Saint Helena" },
        {
          value: "🇰🇳 Saint Kitts and Nevis",
          label: "🇰🇳 Saint Kitts and Nevis",
        },
        { value: "🇱🇨 Saint Lucia", label: "🇱🇨 Saint Lucia" },
        {
          value: "🇵🇲 Saint Pierre and Miquelon",
          label: "🇵🇲 Saint Pierre and Miquelon",
        },
        {
          value: "🇻🇨 Saint Vincent and the Grenadines",
          label: "🇻🇨 Saint Vincent and the Grenadines",
        },
        { value: "🇼🇸 Samoa", label: "🇼🇸 Samoa" },
        { value: "🇸🇲 San Marino", label: "🇸🇲 San Marino" },
        {
          value: "🇸🇹 Sao Tome and Principe",
          label: "🇸🇹 Sao Tome and Principe",
        },
        { value: "🇸🇦 Saudi Arabia", label: "🇸🇦 Saudi Arabia" },
        { value: "🇸🇳 Senegal", label: "🇸🇳 Senegal" },
        { value: "🇷🇸 Serbia", label: "🇷🇸 Serbia" },
        { value: "🇸🇨 Seychelles", label: "🇸🇨 Seychelles" },
        { value: "🇸🇱 Sierra Leone", label: "🇸🇱 Sierra Leone" },
        { value: "🇲🇫 Saint-Martin", label: "🇲🇫 Saint-Martin" },
        { value: "🇸🇽 Sint Maarten", label: "🇸🇽 Sint Maarten" },
        { value: "🇸🇰 Slovakia", label: "🇸🇰 Slovakia" },
        { value: "🇸🇮 Slovenia", label: "🇸🇮 Slovenia" },
        { value: "🇸🇧 Solomon Islands", label: "🇸🇧 Solomon Islands" },
        { value: "🇸🇴 Somalia", label: "🇸🇴 Somalia" },
        { value: "🇿🇦 South Africa", label: "🇿🇦 South Africa" },
        {
          value: "🇬🇸 South Georgia and the South Sandwich Islands",
          label: "🇬🇸 South Georgia and the South Sandwich Islands",
        },
        { value: "🇸🇸 South Sudan", label: "🇸🇸 South Sudan" },
        { value: "🇱🇰 Sri Lanka", label: "🇱🇰 Sri Lanka" },
        { value: "🇸🇩 Sudan", label: "🇸🇩 Sudan" },
        { value: "🇸🇷 Suriname", label: "🇸🇷 Suriname" },
        {
          value: "🇸🇯 Svalbard and Jan Mayen Islands",
          label: "🇸🇯 Svalbard and Jan Mayen Islands",
        },
        { value: "🇸🇿 Switzerland", label: "🇸🇿 Switzerland" },
        { value: "🇸🇾 Syria", label: "🇸🇾 Syria" },
        { value: "🇹🇼 Taiwan", label: "🇹🇼 Taiwan" },
        { value: "🇹🇯 Tajikistan", label: "🇹🇯 Tajikistan" },
        { value: "🇹🇿 Tanzania", label: "🇹🇿 Tanzania" },
        { value: "🇹🇬 Togo", label: "🇹🇬 Togo" },
        { value: "🇹🇰 Tokelau", label: "🇹🇰 Tokelau" },
        { value: "🇹🇴 Tonga", label: "🇹🇴 Tonga" },
        { value: "🇹🇹 Trinidad and Tobago", label: "🇹🇹 Trinidad and Tobago" },
        { value: "🇹🇳 Tunisia", label: "🇹🇳 Tunisia" },
        { value: "🇹🇷 Turkey", label: "🇹🇷 Turkey" },
        { value: "🇹🇲 Turkmenistan", label: "🇹🇲 Turkmenistan" },
        {
          value: "🇹🇨 Turks and Caicos Islands",
          label: "🇹🇨 Turks and Caicos Islands",
        },
        { value: "🇹🇻 Tuvalu", label: "🇹🇻 Tuvalu" },
        { value: "🇺🇬 Uganda", label: "🇺🇬 Uganda" },
        { value: "🇺🇾 Uruguay", label: "🇺🇾 Uruguay" },
        { value: "🏝 Hawaii", label: "🏝 Hawaii" },
        {
          value: "🇺🇲 USA Minor Outlying Islands",
          label: "🇺🇲 USA Minor Outlying Islands",
        },
        { value: "🇺🇿 Uzbekistan", label: "🇺🇿 Uzbekistan" },
        { value: "🇻🇺 Vanuatu", label: "🇻🇺 Vanuatu" },
        { value: "🇻🇦 Vatican City", label: "🇻🇦 Vatican City" },
        { value: "🇻🇪 Venezuela", label: "🇻🇪 Venezuela" },
        { value: "🇻🇳 Vietnam", label: "🇻🇳 Vietnam" },
        {
          value: "🇻🇬 British Virgin Islands",
          label: "🇻🇬 British Virgin Islands",
        },
        {
          value: "🇻🇮 United States Virgin Islands",
          label: "🇻🇮 United States Virgin Islands",
        },
        {
          value: "🇼🇫 Wallis and Futuna Islands",
          label: "🇼🇫 Wallis and Futuna Islands",
        },
        { value: "🇪🇭 Western Sahara", label: "🇪🇭 Western Sahara" },
        { value: "🇾🇪 Yemen", label: "🇾🇪 Yemen" },
        { value: "🇿🇲 Zambia", label: "🇿🇲 Zambia" },
        { value: "🇿🇼 Zimbabwe", label: "🇿🇼 Zimbabwe" },
      ],
    },
  ];
  function notify1() {
    toast.error("Wrong format! Use png, .jpg, .jpeg", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
  const handleChangeRegion = (options) => {
    let array = [];
    options.map((o) => array.push(o.value));
    setFormJob({ ...formJob, experience: array });
  };
  const handleChangeCountries = (options) => {
    let array = [];
    options.map((o) => array.push(o.value));
    setFormJob({ ...formJob, location: array });
  };

  // const changeHandlerJob = (event) => {
  //     setFormJob({ ...formJob, [event.target.name]: event.target.value });
  // };
  const changeHandlerJob = (event) => {
    const { name, value } = event.target;
    setFormJob({ ...formJob, [name]: value });
  };

  const handleQuillChange = (value) => {
    changeHandlerJob("about", value);
  };

  const subscriptionHandler = async (days, price, oldPrice, name) => {
    try {
      await request(
        "/api/user/payment",
        "PUT",
        {
          ...{ days, price, oldPrice, name },
        },
        null,
        {
          Authorization: `Bearer ${auth.accessToken}`,
        }
      ).then(async (res) => {
        window.location.href = res.data;
      });
    } catch (e) {}
  };

  const handleCreateAJob = async () => {
    if (
      !formJob.title ||
      !formJob.company ||
      !formJob.type ||
      !formJob.location ||
      !formJob.priceFrom ||
      !formJob.priceTo ||
      !formJob.link ||
      !formJob.experience ||
      !formJob.about
    ) {
      return;
    }
    
    if(formJobImage){
        localStorage.setItem("image", JSON.stringify(formJobImage));
    }

    localStorage.setItem("job", JSON.stringify(formJob));


    await request("/api/user/me", "GET", null, null, {
      Authorization: `Bearer ${auth.accessToken}`,
    }).then(async (res) => {
      subscriptionHandler(formJob.days, ababa123 ? ababa123.price : 15, ababa123 ? ababa123.days : 30, "Create job");
    });
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  const onClickInputFile = async (e) => {
    e.target.value = null;
  };

  const handleChange = async (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      const fileExtension = newImage.name.split(".").pop().toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png"];

      if (allowedExtensions.includes(fileExtension)) {
        newImage["id"] = Math.random();
        let file_preview = await getBase64(newImage);
        setPreview(file_preview);
        setImages(newImage);
        setFormJobImage({
          file: file_preview,
          name: newImage.name,
          type: newImage.type,
        });
      } else {
        notify1();
      }
    }
  };

  const handleDeleteImage = () => {
    setPreview(null);
    setImages(null);
    setFormJobImage(null);
    localStorage.removeItem("image");
  };
  const Uploader = ({ handleChange, accept, onClick }) => {
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
    />;
    return (
      <form className="form-fireBaseUploader" method="POST">
        <div className="images__add-form">
          <label htmlFor="file-upload" className="custom-file-upload">
            <div>
              <svg
                fill="#000000"
                width="60px"
                height="60px"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.845 8.124c-1.395-3.701-4.392-6.045-8.921-6.045-5.762 0-9.793 4.279-10.14 9.86-2.778 0.889-4.784 3.723-4.784 6.933 0 3.93 3.089 7.249 6.744 7.249h2.889c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2.889c-2.572 0-4.776-2.404-4.776-5.249 0-2.514 1.763-4.783 3.974-5.163l0.907-0.156-0.080-0.916-0.008-0.011c0-4.871 3.205-8.545 8.161-8.545 3.972 0 6.204 1.957 7.236 5.295l0.214 0.688 0.721 0.015c3.715 0.078 6.972 3.092 6.972 6.837 0 3.408-2.259 7.206-5.678 7.206h-2.285c-0.552 0-1 0.448-1 1s0.448 1 1 1l2.277-0.003c5-0.132 7.605-4.908 7.605-9.203 0-4.616-3.617-8.305-8.14-8.791zM16.75 16.092c-0.006-0.006-0.008-0.011-0.011-0.016l-0.253-0.264c-0.139-0.146-0.323-0.219-0.508-0.218-0.184-0.002-0.368 0.072-0.509 0.218l-0.253 0.264c-0.005 0.005-0.006 0.011-0.011 0.016l-3.61 3.992c-0.28 0.292-0.28 0.764 0 1.058l0.252 0.171c0.28 0.292 0.732 0.197 1.011-0.095l2.128-2.373v10.076c0 0.552 0.448 1 1 1s1-0.448 1-1v-10.066l2.199 2.426c0.279 0.292 0.732 0.387 1.011 0.095l0.252-0.171c0.279-0.293 0.279-0.765 0-1.058z"></path>
              </svg>
            </div>
            <div>Browse Files</div>
            <div>Click and select a file</div>
          </label>
          <input
            id="file-upload"
            type="file"
            onClick={onClick}
            onChange={handleChange}
            accept={accept}
            required
          />
        </div>
      </form>
    );
  };
  return (
    <div className="group-12">
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
      <div className="group-123">
        <h1 className="title">Create a job offer</h1>
        <form className="frame-137">
          <div className="item-job-block">
            <div className="group-6">
              <div className="job-title">Job Title</div>
              <div className="overlap-group-6">
                <input
                  className="job-title-1"
                  name="title"
                  value={formJob.title}
                  onChange={changeHandlerJob}
                  required
                ></input>
              </div>
            </div>
          </div>
          <div className="item-job-block">
            <div className="group-6">
              <div className="job-title">Company name</div>
              <div className="overlap-group-6">
                <input
                  className="job-title-1"
                  name="company"
                  value={formJob.company}
                  onChange={changeHandlerJob}
                  required
                ></input>
              </div>
            </div>
          </div>
          <div className="item-job-block">
            <div className="group-6">
              <div className="job-title">Company logo</div>
              <div className="overlap-group-61">
                <Uploader
                  handleChange={handleChange}
                  accept=".png, .jpg, .jpeg"
                  onClick={onClickInputFile}
                  required
                />
                <div className="create-left-grid">
                  {preview && preview.length >= 1 && (
                    <div className="imgs-wrapper">
                      <div className="image-preview">
                        <img src={preview} alt="" className="" />
                        <div className="button-create-wrapper">
                          <button
                            className="button-create-delete"
                            onClick={handleDeleteImage}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="item-job-block">
            <div className="group-6">
              <div className="job-title">Contract/Remote Job</div>
              <div className="overlap-group-6">
                <select
                  className="job-choose"
                  name="type"
                  value={formJob.type}
                  onChange={changeHandlerJob}
                  required
                >
                  <option>💻Contract</option>
                  <option>💼Remote</option>
                </select>
              </div>
            </div>
          </div>
          <div className="item-job-block">
            <div className="group-6">
              <div className="job-title">Location</div>
              <Select
                className="overlap-group-6"
                isMulti={true}
                styles={customStyles}
                value={formJob.location.map((option) => ({
                  value: option,
                  label: option,
                }))}
                options={locationOptions}
                onChange={handleChangeCountries}
                required
              ></Select>
            </div>
          </div>
          <div className="item-job-block">
            <div className="price-wrapper">
              <div className="price-block">
                <div className="job-title">Less price</div>
                <input
                  className="job-title-2"
                  name="priceFrom"
                  value={formJob.priceFrom}
                  onChange={changeHandlerJob}
                  required
                ></input>
              </div>
              <div className="price-block">
                <div className="job-title">Above price</div>
                <input
                  className="job-title-2"
                  name="priceTo"
                  value={formJob.priceTo}
                  onChange={changeHandlerJob}
                  required
                ></input>
              </div>
            </div>
          </div>
          <div className="item-job-block">
            <div className="group-6">
              <div className="job-title">Link to Apply</div>
              <div className="overlap-group-6">
                <input
                  className="job-title-1"
                  name="link"
                  value={formJob.link}
                  onChange={changeHandlerJob}
                  required
                ></input>
              </div>
            </div>
          </div>
          <div className="item-job-block">
            <div className="group-6">
              <div className="job-title">Experience</div>
              <Select
                className="overlap-group-6"
                isMulti={true}
                styles={customStyles}
                value={formJob.experience.map((option) => ({
                  value: option,
                  label: option,
                }))}
                options={experienceOptions}
                onChange={handleChangeRegion}
                required
              ></Select>
            </div>
          </div>
          <div className="item-job-block">
            <div className="group-6">
              <div className="job-title">Job Description</div>
              <ReactQuill
                className="overlap-group-reactquill"
                theme="snow"
                name="about"
                value={formJob.about}
                onChange={(value) =>
                  changeHandlerJob({ target: { name: "about", value } })
                }
                modules={modules}
                required
              ></ReactQuill>
            </div>
          </div>
          <div className="button-wrapper">
            <button
              type="submit"
              className="add-btn"
              onClick={handleCreateAJob}
              disabled={loading}
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobOffer;