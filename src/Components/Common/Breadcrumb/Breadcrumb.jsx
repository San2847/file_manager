import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./breadcrumb.module.css";

const Breadcrumb = ({ pathArr }) => {
  const navigateTo = useNavigate();
  let arrPath = JSON.parse(pathArr);
  return (
    <div className="d-flex align-items-start">
      {arrPath &&
        arrPath.map((curElem, index, arr) => {
          if (index === arr.length - 1) {
            return (
              <span
                className={styles.pathLink}
                onClick={() => {
                  if (curElem.link) {
                    window.location.assign(curElem.link);
                  } else if (curElem.navTo) {
                    navigateTo(curElem.navTo);
                  }
                }}
              >
                {curElem.label}
              </span>
            );
          } else {
            return (
              <span
                className={styles.pathLink}
                onClick={() => {
                  if (curElem.link) {
                    window.location.assign(curElem.link);
                  } else if (curElem.navTo) {
                    navigateTo(curElem.navTo);
                  }
                }}
              >
                {`${curElem.label}>`}
              </span>
            );
          }
        })}
    </div>
  );
};

export default Breadcrumb;
