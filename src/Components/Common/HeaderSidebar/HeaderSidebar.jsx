import React, { useEffect, useRef, useState } from "react";
import styles from "./headerSidebar.module.css";
import logo from "../../../Assets/comp_logo.svg";
import { AiOutlineShoppingCart, AiOutlinePlus } from "react-icons/ai";
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

const HeaderSidebar = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { id } = useParams();

  const [profileData, setProfileData] = useState({});

  const getProfileData = async () => {
    const res = await getReq(`${apiLinks.crm}/user/profile`, {}, { Authorization: `Bearer ${getToken()}` });
    if (res && !res.error) {
      setProfileData({ ...res.data.data });
      dispatch(saveProfileData({ ...res.data.data }));
    } else {
      // console.log(res.error);
      // localStorage.clear();
      // window.location.assign(`${BASE_URL}`);
    }
  };

  const gotohome = () => {
    // if (getToken()) {
    //   window.location.assign(`${BASE_URL}/leads/`);
    // } else {
    //   window.location.assign(`${BASE_URL}/`);
    // }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const handleButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
  return (
    <div className={styles.container} style={{ zIndex: isDropdownOpen ? "999" : "0" }}>
      <div className={styles.header}>
        <div className={styles.logobox} onClick={gotohome}>
          <img src={logo} alt="" />
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
          {/* <div className={styles.notification}>
            <BsBell />
          </div>
          <div className={styles.cart}>
            <AiOutlineShoppingCart />
          </div> */}
          <div className={styles.profileNameBox} onClick={handleButtonClick}>
            <div className={styles.profileName}>
              {profileData.fullName} <BsChevronDown style={{ marginLeft: "0.25rem" }} />
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <div className={styles.dropdownItem} onClick={handleDropdownItemClick}>
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
                    curElem.visible && (
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
