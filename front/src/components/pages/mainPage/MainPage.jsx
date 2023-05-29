import "./MainPage.scss";
import { React, useState, useEffect, useCallback, useContext } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useHttp } from "../../../hooks/http.hook";
import imageright from "../../../images/decor/noimage.png";
import { AuthContext } from "../../../context/AuthContext";
import Select from "react-select";
import jsonJobs from "../../../output.json";

const Post = ({ job, isMy, isLoading, topCount }) => {
  const [numItems, setNumItems] = useState(window.innerWidth <= 845 ? 2 : window.innerWidth <= 1235 ? 3 : 4)

  const [showDetails, setShowDetails] = useState(false);
  const [maxElements, setMaxElements] = useState(3);
  const [isActive, setIsActive] = useState(job.isActive);
  const { loading, request } = useHttp();
  const auth = useContext(AuthContext);

  const handleMoreInfoClick = (event) => {
    const item = event.currentTarget;
    item.style.borderBottomLeftRadius = showDetails ? '36px' : '0px';
    item.style.borderBottomRightRadius = showDetails ? '36px' : '0px';
    setShowDetails(!showDetails);
    setMaxElements(showDetails ? 3 : 8);
  };
  useEffect(() => {
    const handleResize = () => {
      setNumItems(window.innerWidth <= 845 ? 2 : window.innerWidth <= 1235 ? 3 : 4);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}d`;
  };

  const isValidJob = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  };

  const topHandler = async (days, price, oldPrice, name) => {
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
    } catch (e) { }
  };

  const handleTop = async (_id) => {
    localStorage.removeItem("renewal");
    localStorage.setItem("top", JSON.stringify(_id));
    await request("/api/user/me", "GET", null, null, {
      Authorization: `Bearer ${auth.accessToken}`,
    }).then(async (res) => {
      topHandler(30, 15, 30, "Go to top");
    });
  };

  const handleRenewal = async (_id) => {
    localStorage.removeItem("top");
    localStorage.setItem("renewal", JSON.stringify(_id));
    await request("/api/user/me", "GET", null, null, {
      Authorization: `Bearer ${auth.accessToken}`,
    }).then(async (res) => {
      topHandler(30, 10, 30, "Renewal");
    });
  };

  const handleDiactivate = async () => {
    await request("/api/job/update", "PUT", { _id: job._id, isActive: false }, null, {
      Authorization: `Bearer ${auth.accessToken}`,
    });
    setIsActive(false);
  };

  const handleActive = async () => {
    await request("/api/job/update", "PUT", { _id: job._id, isActive: true }, null, {
      Authorization: `Bearer ${auth.accessToken}`,
    });
    setIsActive(true);
  };

  return (
    <div className="jobs">

      <div className="item" onClick={handleMoreInfoClick}>
        {job.isTop && isLoading ? <div className="top-block" >
          <span className="top-text">TOP</span>
        </div> : <></>}
        <div className="left-side-job">
          <div className="company-logo">
            <img
              className="logo-img-job"
              src={
                job.imagesUrls && job.imagesUrls.length && isLoading
                  ? job.imagesUrls[0]
                  : job.imageUrl || imageright
              }
            ></img>
          </div>
          <div className="left-info-text">
            <span className="uiux-designer">{isLoading ? job.title : "ABABABA"}</span>
            <span className="name-1 ">{isLoading ? job.company : "ABABABA"}</span>
            <div className="bottom-info-text">
              {isLoading ? job.location 
                .concat([`💰$${job.priceFrom} - $${job.priceTo}`, job.type])
                .slice(0, showDetails ? maxElements + 4 : numItems)
                .map((item, index) => (
                  <span key={index} className="bottom-item">
                    {item}
                  </span>
                )) : <></>}
            </div>
          </div>
        </div>
        <div className="center-side-job">
          <div className="experience-wrapper">
          {isLoading ? job.experience && job.experience.slice(0, maxElements).map((item, index) => (
              <div className="experience-items" key={index}>
                {item}
              </div>
            )): <></>}
          </div>
        </div>
        <div className="right-side-job">
          <div className="right-side-in-content">
            <a className="days-job">{isLoading ? formatDate(job.createdAt) : "ABABABA"}</a>
            {(!isMy && isLoading) ? (
              <a href={job.link} className="apply-btn-job">
                Apply
              </a>
            ) : (isMy && isLoading) ? (
              <a
                onClick={(e) => {
                  if (topCount <= 10 && !job.isTop) {
                    handleTop(job._id);
                  }
                  e.stopPropagation();
                }}
                className={`apply-btn-job ${job.isTop ? 'active' : ''}`}
              >
                {!job.isTop ? "Go to top" : "In top"}
              </a>
            ) : (
              < >
                
              </>
            )
            }
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="backgrounds">
          <div className="info-header">
            <div className="left-info-background">
              {/* <img className="check" src="check.png" alt="check" /> */}
              <p className="text-1-2">{job.title}</p>
              <div className="company-logo-wrapper">
                <div className="company-logo">
                  <img
                    className="logo-img-job"
                    src={
                      job.imagesUrls && job.imagesUrls.length
                        ? job.imagesUrls[0]
                        : job.imageUrl || imageright
                    }
                  ></img>
                </div>
                <p className="text-1-1">{job.company}</p>
              </div>
            </div>
            {/* <div className="right-info-background">
              <div className="mobile">
                <img className="call" src="call.png" alt="call" />
                <div className="text-6">{job.phone}</div>
              </div>
              <div className="web"><a href={job.link}>
                <div className="wwwoschadbankua">{job.link}</div></a>
              </div>
            </div> */}
          </div>
          <div className="other-info">

            <div className="group-129">
              <div className="text-5">About company</div>
              <div
                dangerouslySetInnerHTML={{ __html: job.about }}
                className="text-4"
              >

              </div>
            </div>
            {/* 
            <div className="group-129">
              <div className="text-5">Requirements</div>
              <ul className="text-4">
                {job.requirements}
              </ul>
            </div> */}

            <div className="group-129">
              <div className="text-5">Benefits</div>
              <ul className="text-4">
                {
                  job.experience.map((job, index) => {
                    return (<li>
                      {job}
                    </li>)
                  })
                }
              </ul>
            </div>

            <div className="group-129">
              <div className="text-5">Salary and compensation</div>
              <p className="text-4">
                💰${job.priceFrom} - ${job.priceTo}
              </p>
            </div>
          </div>
          <div className="background-button">
            {!isMy ? (
              <a href={job.link} className="apply-btn-job1">
                Apply
              </a>
            ) : isActive ? (
              <div className="bottom-btn-wrapper">
                <a className="bottom-btn-background"
                  onClick={() => {
                    handleRenewal(job._id);
                  }}>Renewal
                </a>
                <a className="bottom-btn-background" onClick={handleDiactivate}>
                  {isActive ? "Deactivate" : "Activate"}
                </a>
              </div>
            ) : !isValidJob(job.validityDate) ? (
              <div className="bottom-btn-wrapper">
                <a className="bottom-btn-background"
                  onClick={() => {
                    handleRenewal(job._id);
                  }}>Renewal
                </a>
                <a className="bottom-btn-background" onClick={handleActive}>
                  {isActive ? "Deactivate" : "Activate"}
                </a>
              </div>
            ) : (
              <a className="bottom-btn-background"
                onClick={() => {
                  handleRenewal(job._id);
                }}>Renewal
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
};

const MainPage = () => {

  const { loading, request } = useHttp();
  const auth = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Newest");
  const [showMyJobs, setShowMyJobs] = useState(false);
  const [loader, setLoader] = useState(false);
  const [topCount, setTopCount] = useState(0);
  const [searchCount, setSearchCount] = useState(0);

  const renderJSONJobs = () => {
    return jsonJobs.Parse.map((job, index) => (
      <Post
        job={job}
        isMy={showMyJobs}
        key={index}
        isLoading={loader}
        topCount={topCount}
      />
    ));
  };
  
  const fetchJobs = useCallback(async () => {
    try {
      setLoader(false)
      const allfetched = [];
      let url = `/api/job/find?isActive=true&limit=${limit}`;

      if (auth.accessToken && !showMyJobs && !searchCount) {
        await request("/api/user/me", "GET", null, null, {
          Authorization: `Bearer ${auth.accessToken}`,
        }).then(async (res) => {
          url =
            `/api/job/find/not/my?user_id=${res.user._id}&isActive=true&limit=${limit}`;
        });
      }

      if (showMyJobs && !searchCount) {
        await request("/api/user/me", "GET", null, null, {
          Authorization: `Bearer ${auth.accessToken}`,
        }).then(async (res) => {
          url = `/api/job/find?user_id=${res.user._id}&limit=${limit}`;

          await request(`/api/job/find?isTop=true`, "GET").then(async (res) => {
            setTopCount(res.jobs.length);
          });
        });
      }

      if (searchCount) {
        setShowMyJobs(false);
        if (formJob.experience.length && !formJob.location.length) {
          auth.accessToken ? await request("/api/user/me", "GET", null, null, {
            Authorization: `Bearer ${auth.accessToken}`,
          }).then(async (res) => {
            url =
              `/api/job/find/not/my?user_id=${res.user._id}&experience=${formJob.experience}&isActive=true&limit=${limit}`;
          }) : url = `/api/job/find?experience=${formJob.experience}&isActive=true&limit=${limit}`;
        }
        else if (!formJob.experience.length && formJob.location.length) {
          auth.accessToken ? await request("/api/user/me", "GET", null, null, {
            Authorization: `Bearer ${auth.accessToken}`,
          }).then(async (res) => {
            url =
              `/api/job/find/not/my?user_id=${res.user._id}&location=${formJob.location}&isActive=true&limit=${limit}`;
          }) : url = `/api/job/find?location=${formJob.location}&isActive=true&limit=${limit}`;
        }
        else if (formJob.experience.length && formJob.location.length) {
          auth.accessToken ? await request("/api/user/me", "GET", null, null, {
            Authorization: `Bearer ${auth.accessToken}`,
          }).then(async (res) => {
            url =
              `/api/job/find/not/my?user_id=${res.user._id}&experience=${formJob.experience}&location=${formJob.location}&isActive=true&limit=${limit}`;
          }) : url = `/api/job/find?experience=${formJob.experience}&location=${formJob.location}&isActive=true&limit=${limit}`;
        }
        else {
          auth.accessToken ? await request("/api/user/me", "GET", null, null, {
            Authorization: `Bearer ${auth.accessToken}`,
          }).then(async (res) => {
            url =
              `/api/job/find/not/my?user_id=${res.user._id}&isActive=true&limit=${limit}`;
          }) : url = `/api/job/find?isActive=true&limit=${limit}`;
        }
      }

      await request(url).then((res) => {
        const topJobs = res.jobs.filter((job) => job.isTop);
        let sortedTopJobs = [];
        if (sortOption === "Newest") {
          sortedTopJobs = topJobs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (sortOption === "Oldest") {
          sortedTopJobs = topJobs.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        }

        let sortedJobs = res.jobs.filter((job) => !job.isTop);
        if (sortOption === "Newest") {
          sortedJobs = sortedJobs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (sortOption === "Oldest") {
          sortedJobs = sortedJobs.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        }

        sortedJobs = sortedTopJobs.concat(sortedJobs);
        allfetched.push(sortedJobs);
        setJobs([].concat(...allfetched));
        setHasMoreJobs(res.jobs.length >= limit);
      });
      setLoader(true);
    } catch (e) { }
  }, [request, limit, showMyJobs, sortOption, searchCount]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, searchCount]);


  const handleShowMyJobsClick = () => {
    setShowMyJobs(true);
  };

  const handleShowAllJobsClick = () => {
    setShowMyJobs(false);
  };

  const handleSearchClick = () => {
    if (
      !formJob.location.length &&
      !formJob.experience.length
    ) {
      return;
    }


    setSearchCount(searchCount + 1);
  };

  const handleClearClick = () => {
    setSearchCount(0);
    formJob.location = [];
    formJob.experience = [];
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const isBottom = scrollTop + clientHeight === scrollHeight;
    if (isBottom && hasMoreJobs && !loading) {
      setLimit(limit + 10);
    }
  }, [hasMoreJobs, loading, limit]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const [formJob, setFormJob] = useState({
    location: [],
    experience: []
  });

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
      ]
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
        { value: "🇮🇴 British Indian Ocean Territory", label: "🇮🇴 British Indian Ocean Territory" },
        { value: "🇧🇳 Brunei", label: "🇧🇳 Brunei" },
        { value: "🇧🇬 Bulgaria", label: "🇧🇬 Bulgaria" },
        { value: "🇧🇫 Burkina Faso", label: "🇧🇫 Burkina Faso" },
        { value: "🇧🇮 Burundi", label: "🇧🇮 Burundi" },
        { value: "🇰🇭 Cambodia", label: "🇰🇭 Cambodia" },
        { value: "🇨🇲 Cameroon", label: "🇨🇲 Cameroon" },
        { value: "🇨🇻 Cape Verde", label: "🇨🇻 Cape Verde" },
        { value: "🇰🇾 Cayman Islands", label: "🇰🇾 Cayman Islands" },
        { value: "🇨🇫 Central African Republic", label: "🇨🇫 Central African Republic" },
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
        { value: "🇹🇫 French Southern Territories", label: "🇹🇫 French Southern Territories" },
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
        { value: "🇭🇲 Heard Island and McDonald Islands", label: "🇭🇲 Heard Island and McDonald Islands" },
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
        { value: "🇧🇶 Caribbean Netherlands", label: "🇧🇶 Caribbean Netherlands" },
        { value: "🇳🇨 New Caledonia", label: "🇳🇨 New Caledonia" },
        { value: "🇳🇮 Nicaragua", label: "🇳🇮 Nicaragua" },
        { value: "🇳🇪 Niger", label: "🇳🇪 Niger" },
        { value: "🇳🇬 Nigeria", label: "🇳🇬 Nigeria" },
        { value: "🇳🇺 Niue", label: "🇳🇺 Niue" },
        { value: "🇳🇫 Norfolk Island", label: "🇳🇫 Norfolk Island" },
        { value: "🇲🇵 Northern Mariana Islands", label: "🇲🇵 Northern Mariana Islands" },
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
        { value: "🇰🇳 Saint Kitts and Nevis", label: "🇰🇳 Saint Kitts and Nevis" },
        { value: "🇱🇨 Saint Lucia", label: "🇱🇨 Saint Lucia" },
        { value: "🇵🇲 Saint Pierre and Miquelon", label: "🇵🇲 Saint Pierre and Miquelon" },
        { value: "🇻🇨 Saint Vincent and the Grenadines", label: "🇻🇨 Saint Vincent and the Grenadines" },
        { value: "🇼🇸 Samoa", label: "🇼🇸 Samoa" },
        { value: "🇸🇲 San Marino", label: "🇸🇲 San Marino" },
        { value: "🇸🇹 Sao Tome and Principe", label: "🇸🇹 Sao Tome and Principe" },
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
        { value: "🇬🇸 South Georgia and the South Sandwich Islands", label: "🇬🇸 South Georgia and the South Sandwich Islands" },
        { value: "🇸🇸 South Sudan", label: "🇸🇸 South Sudan" },
        { value: "🇱🇰 Sri Lanka", label: "🇱🇰 Sri Lanka" },
        { value: "🇸🇩 Sudan", label: "🇸🇩 Sudan" },
        { value: "🇸🇷 Suriname", label: "🇸🇷 Suriname" },
        { value: "🇸🇯 Svalbard and Jan Mayen Islands", label: "🇸🇯 Svalbard and Jan Mayen Islands" },
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
        { value: "🇹🇨 Turks and Caicos Islands", label: "🇹🇨 Turks and Caicos Islands" },
        { value: "🇹🇻 Tuvalu", label: "🇹🇻 Tuvalu" },
        { value: "🇺🇬 Uganda", label: "🇺🇬 Uganda" },
        { value: "🇺🇾 Uruguay", label: "🇺🇾 Uruguay" },
        { value: "🏝 Hawaii", label: "🏝 Hawaii" },
        { value: "🇺🇲 USA Minor Outlying Islands", label: "🇺🇲 USA Minor Outlying Islands" },
        { value: "🇺🇿 Uzbekistan", label: "🇺🇿 Uzbekistan" },
        { value: "🇻🇺 Vanuatu", label: "🇻🇺 Vanuatu" },
        { value: "🇻🇦 Vatican City", label: "🇻🇦 Vatican City" },
        { value: "🇻🇪 Venezuela", label: "🇻🇪 Venezuela" },
        { value: "🇻🇳 Vietnam", label: "🇻🇳 Vietnam" },
        { value: "🇻🇬 British Virgin Islands", label: "🇻🇬 British Virgin Islands" },
        { value: "🇻🇮 United States Virgin Islands", label: "🇻🇮 United States Virgin Islands" },
        { value: "🇼🇫 Wallis and Futuna Islands", label: "🇼🇫 Wallis and Futuna Islands" },
        { value: "🇪🇭 Western Sahara", label: "🇪🇭 Western Sahara" },
        { value: "🇾🇪 Yemen", label: "🇾🇪 Yemen" },
        { value: "🇿🇲 Zambia", label: "🇿🇲 Zambia" },
        { value: "🇿🇼 Zimbabwe", label: "🇿🇼 Zimbabwe" }
      ]
    },
  ];

  const handleChangeRegion = (options) => {
    let array = [];
    options.slice(0, 5).map((o) => array.push(o.value));
    setFormJob({ ...formJob, experience: array });
  };
  const handleChangeCountries = (options) => {
      let array = [];
      options.slice(0, 5).map((o) => array.push(o.value));
      setFormJob({ ...formJob, location: array });
  };
  
  return (
    <div className="main-page">
      <div className="main-content">
        <div className="search-and-filter">
          <div className="search-and-filter-1">
            <div className="search-form-wrapper">
              <div className="flex-box-search">

                Finding a remote job as a
                <Select
                  value={formJob.experience.map((option) => ({ value: option, label: option }))}
                  options={experienceOptions}
                  onChange={handleChangeRegion}
                  className="overlap-group-6"
                  isMulti={true}
                  required
                  placeholder="position"
                >
                </Select>
                in
                <Select
                  value={formJob.location.map((option) => ({ value: option, label: option }))}
                  options={locationOptions}
                  onChange={handleChangeCountries}
                  className="overlap-group-6"
                  isMulti={true}
                  required
                  placeholder="country"
                >
                </Select>
                is so easy
              </div>
              {!searchCount ?
                <a type="submit" className="search-button" onClick={handleSearchClick}>Start</a>
                :
                <div className="search-buttons-wrapper">
                  <a type="submit" className="search-button" onClick={handleSearchClick}>Start</a>
                  <a type="submit" className="search-button" onClick={handleClearClick}>Clear</a>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="main-jobs-wrapper">
          <div className="job-post-wrapper">
            <div className="available-jobs">
              <span className="left-element">Showing {jobs.length} result</span>
              <div className="right-element">

                {auth.accessToken && (
                  <div className="job-post-header">
                    {showMyJobs ? (
                      <button className="choose-my-ads" onClick={handleShowAllJobsClick} disabled={loading}>
                        All ads
                      </button>
                    ) : (
                      <button className="choose-my-ads" onClick={handleShowMyJobsClick} disabled={loading}>
                        My Ads
                      </button>
                    )}
                  </div>
                )}

                <div className="sort-wrapper">
                  <span className="contract">Sort Posts by:</span>
                  <div className={`dropdown-container ${isDropdownOpen ? "active" : ""}`}>
                    <button className="filtration-block" onClick={handleDropdownToggle}>
                      <span className="selected-option">{sortOption}</span>
                      <span
                        aria-hidden="true"
                        className={`svg-arrow-drop ${isDropdownOpen ? "rotate-180" : ""}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          aria-hidden="true"
                          className="svg-arrow-element"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </button>
                    {isDropdownOpen && (
                      <div className="dropdown active">
                        <div className="dropdown-menu">
                          <div
                            className="dropdown-item"
                            onClick={() => {
                              setSortOption("Newest");
                              setIsDropdownOpen(false);
                            }}
                          >
                            Newest
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={() => {
                              setSortOption("Oldest");
                              setIsDropdownOpen(false);
                            }}
                          >
                            Oldest
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
            <div className="all-jobs-wrapper">
            {/* {renderJSONJobs()} */}
              {jobs.map((job, index) => {
                if (index < limit) {
                  return (
                    <Post
                      job={job}
                      isMy={showMyJobs}
                      key={job.id}
                      isLoading={loader}
                      topCount={topCount}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage;