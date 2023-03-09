import React, { useEffect, useRef, useState } from "react";
import styles from "./headerSidebar.module.css";
import logo from "../../../Assets/comp_logo.svg";
import { AiOutlineShoppingCart, AiOutlinePlus } from "react-icons/ai";
import { BsBell, BsChevronDown } from "react-icons/bs";
import { Link } from "react-router-dom";
import { sidebarLinks } from "./sidebarLinks";
import { FaPhoneSquareAlt } from "react-icons/fa";
import medal from "./SidebarAssets/medal.svg";

const HeaderSidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleDropdownItemClick = () => {
    console.log("hello");
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
        <div className={styles.logobox}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.menubox}>
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
        </div>
        <div className={styles.profilebox}>
          <div className={styles.notification}>
            <BsBell />
          </div>
          <div className={styles.cart}>
            <AiOutlineShoppingCart />
          </div>
          <div className={styles.profileNameBox} onClick={handleButtonClick}>
            <div className={styles.profileName}>
              Name <BsChevronDown style={{ marginLeft: "0.25rem" }} />
            </div>
            <div className={styles.planPill}>Free Plan</div>
            {isDropdownOpen && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <div className={styles.dropdownItem} onClick={handleDropdownItemClick}>
                  Item 1
                </div>
                <div className={styles.dropdownItem} onClick={handleDropdownItemClick}>
                  Item 2
                </div>
                <div className={styles.dropdownItem} onClick={handleDropdownItemClick}>
                  Item 3
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.sidebar}>
        <div style={{ height: "80%" }}>
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
                  <div key={index} className={styles.sidebarItem}>
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
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.upgradeContainer}>
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
        </div>
      </div>
    </div>
  );
};

export default HeaderSidebar;
