import React, { useEffect, useRef, useState } from "react";
import styles from "./headerSidebar.module.css";
import logo from "./SidebarAssets/idesign_logo.svg";
import { AiOutlineShoppingCart, AiOutlinePlus, AiOutlineBell } from "react-icons/ai";
import { BsBell, BsChevronDown } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { sidebarLinks } from "./sidebarLinks";
import { FaPhoneSquareAlt } from "react-icons/fa";
import medal from "./SidebarAssets/medal.svg";
import { apiLinks, BASE_URL } from "../../../constants/constants";
import { getReq } from "../../../Services/api";
import { getToken } from "../../../Services/authService";
import { useDispatch } from "react-redux";
import { saveProfileData } from "../../../Redux/slices/filemanagerSlice";
import AllProjectListPanel from "../AllProjectListPanel/AllProjectListPanel";
import { IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
const HeaderSidebar = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
const [data, setData] = useState([]);
const [unreadCount, setUnreadCount] = useState("")
  const dropdownRef = useRef(null);

  const { id } = useParams();

  const [profileData, setProfileData] = useState({});

  const getProfileData = async () => {
    const res = await getReq(`${apiLinks.crm}/user/profile`, {}, { Authorization: `Bearer ${getToken()}` });
    if (res && !res.error) {
      setProfileData({ ...res.data.data });
      dispatch(saveProfileData({ ...res.data.data }));
    } 
    // else {
    //   console.log(res.error);
    //   localStorage.clear();
    //   window.location.assign(`${BASE_URL}`);
    // }
  };

  const gotohome = () => {
    // if (getToken()) {
    //   window.location.assign(`${BASE_URL}/leads/`);
    // } else {
    //   window.location.assign(`${BASE_URL}/`);
    // }
  };

  const [aclData, setAclData] = useState([]);
  const getAclData = async () => {
    const res = await getReq(`${apiLinks.crm}/user/get-features-list?userId=${localStorage.getItem("userId")}`);
    if (res && !res.error) {
      // setProfileData({ ...res.data.data });
      setAclData(res?.data?.data)
      // console.log(res.data)
    }
    // else {
    //   console.log(res.error);
    //   localStorage.clear();
    //   window.location.assign(`${BASE_URL_ESS}`);
    // }
  };

  useEffect(() => {
    getAclData()
  }, [])
  useEffect(() => {
    getProfileData();
  }, []);

  const handleButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleButtonClickNotification = () => {
    setIsNotification(!isNotification);
};
  const handleDropdownItemClick = () => {
    localStorage.clear();
    window.location.assign(`${BASE_URL}/`);
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  let readAll = {
    ids: [],
    userId: "",
  };

  
  let idArray = [];
  // const userIdData = localStorage.getItem("userId")

  // const getNotifications = async () => {
  //   const getNotify = await axios.get(
  //     `https://notify-api.essentiaenvironments.com/api/notifications/get-notifications?userId=${localStorage.getItem(
  //       "userId"
  //     )}`
  //   );
  //   setData(getNotify.data.slice(0, 9));
  // };

  // const readBy = async () => {
  //   readAll.ids = [...idArray];
  //   readAll.userId = localStorage.getItem("userId");
  //   return await axios
  //     .post(
  //       "https://notify-api.essentiaenvironments.com/api/notifications/add-readedBy",
  //       readAll
  //     )
  //     .then((res) => getNotifications())
  //     .catch((err) => console.log(err));
  // };
  // useEffect(() => {
  //   getNotifications();
  // }, []);
  // const loadMore = async () => {
  //   const getNotify = await axios.get(
  //     `https://notify-api.essentiaenvironments.com/api/notifications/get-notifications?userId=${localStorage.getItem(
  //       "userId"
  //     )}`
  //   );
  //   setData(getNotify.data);
  // };

  // const unread = async () => {
  //   const getUnread = await axios.get(
  //     `https://notify-api.essentiaenvironments.com/api/notifications/get-unread-notification-count?userId=${localStorage.getItem(
  //       "userId"
  //     )}`
  //   );
  //   setUnreadCount(getUnread.data.unreadNotification)
  // };
  // useEffect(() => {
  //   unread()
  // }, [])
  // const getTime = (date) => {
  //   if (date === undefined) {
  //     return "-";
  //   } else if (typeof date === "string") {
  //     date = new Date(date);
  //   }

  //   let day = date.getDate();
  //   let month = date.toLocaleDateString("default", { month: "short" });
  //   let year = date.getFullYear() % 100;
  //   let ans = "";
  //   ans += day + "-";
  //   ans += month + "-";
  //   ans += year;
  //   return ans;
  // };


  return (
    <div className={styles.container} style={{ zIndex: isDropdownOpen || isNotification ? "999" : "0" }}>
      <div className={styles.header}>
        <div className={styles.logobox} onClick={gotohome}>
          <img src={logo} alt="" height="28"/>
        </div>
        {/* <div className={styles.menubox}>
          <div className={styles.eachHeaderLink}>
            <Link to="/">Manage Leads</Link>
          </div>
          <div className={styles.eachHeaderLink}>
            <Link to="/about">Buy Leads</Link>
          </div>
          <div className={styles.eachHeaderLink}>
            <Link to="/services">Book 3D Service</Link>
          </div>
          <div className={styles.eachHeaderLink}>
            <Link to="/contact">Community</Link>
          </div>
        </div> */}
        <div className={styles.profilebox}>
           <div className={styles.notification}>
            <BsBell />
          </div>
        {/*  <div className={styles.cart}>
            <AiOutlineShoppingCart />
          </div> */}
         
          <div className={styles.profileNameBox} onClick={handleButtonClick}>
            <div className={styles.profileName}>
              {profileData.fullName} <BsChevronDown style={{ marginLeft: "0.25rem" }} />
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <div
                  style={{}}
                  className={styles.dropdownItem}
                  onClick={() => {
                    window.location.assign(
                      `${BASE_URL}/my-profile/myprofile/personal`);
                  }}
                >
                  My Profile
                </div>
                <div
                  style={{}}
                  className={styles.dropdownItem}
                  onClick={() => {
                    // dispatch(myprofileState(4));
                    window.location.assign(
                      `${BASE_URL}/my-profile/myprofile/accesspanel`);
                  }}
                >
                  Access Panel
                </div>
                <div
                  style={{}}
                  className={styles.dropdownItem}
                  onClick={() => {
                    // dispatch(myprofileState(3));
                    window.location.assign(
                      `${BASE_URL}/my-profile/myprofile/userdirectory`);
                  }}
                >
                  User Directory
                </div>
                <div
                  style={{}}
                  className={styles.dropdownItem}
                  onClick={() => {
                    // dispatch(myprofileState(7));
                    window.location.assign(
                      `${BASE_URL}/my-profile/myprofile/feedback`);
                  }}
                >
                  Send Feedback
                </div>
                <div
                  style={{}}
                  className={styles.dropdownItem}
                  onClick={() => {
                    // dispatch(myprofileState(5));
                    window.location.assign(
                      `${BASE_URL}/library/`
                    );
                  }}
                >
                  Library & Templates
                </div>
                <div
                  style={{}}
                  className={styles.dropdownItem}
                  onClick={handleDropdownItemClick}
                >
                  <span>
                    <IoLogOutOutline />
                  </span>{" "}
                  Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {id ? (
        <AllProjectListPanel projectId={id} />
      ) : (
        <div className={styles.sidebar}>
          <div style={{ height: "100%" }}>
            <div className={styles.createProjectButtonWrapper}>
              <button className={styles.createProjectButton}>
                <AiOutlinePlus style={{ marginRight: "0.25rem" }} />
                Create a Project
              </button>
            </div>
            <div className={styles.linksContainerWrapper}>
              <div className={styles.linksContainer}>
                {sidebarLinks.map((curElem, index) => {
                  return (
                    curElem.visible && (aclData.includes(curElem?.accessName) || curElem?.accessName === "default") && (
                      <div key={index} className={curElem.active ? styles.activeSidebarItem : styles.sidebarItem}>
                        {curElem.link ? (
                          <Link to={curElem.link} className={styles.sidebarLink}>
                            {curElem.icon}
                            <span className={styles.sidebarLabel}>{curElem.label}</span>
                          </Link>
                        ) : (
                          <a href={curElem.href} className={styles.sidebarLink}>
                            {curElem.icon}
                            <span className={styles.sidebarLabel}>{curElem.label}</span>
                          </a>
                        )}
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </div>
          {/* <div className={styles.upgradeContainer}>
          <button className={styles.upgradeButton}>
            <img src={medal} alt="" style={{ marginRight: "0.5rem" }} />
            Upgrade to Premium
          </button>
          <div className={styles.upgradeText}>
            <div>
              <div className={styles.rmName}>Ramesh Rana</div>
              <div className={styles.rmPost}>Relationship manager</div>
            </div>
            <div>
              <FaPhoneSquareAlt fontSize={24} color="#5255A4" />
            </div>
          </div>
        </div> */}
        </div>
      )}
    </div>
  );
};

export default HeaderSidebar;
