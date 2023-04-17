import React, { useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import styles from "./allProjectListPanel.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { innerLinks } from "./innerLinks";
import { getReq } from "../../../Services/api";
import { BASE_URL, apiLinks } from "../../../constants/constants";

const AllProjectListPanel = ({ projectId }) => {
  const navigateTo = useNavigate();
  const projectIdForNav = useSelector((state) => state.filemanager.projectId);
  const [projects, setProjects] = useState([]);
  const [aclData, setAclData] = useState([]);
  const getAclData = async () => {
    const res = await getReq(`${apiLinks.crm}/user/get-features-list?userId=${localStorage.getItem("userId")}`);
    if (res && !res.error) {
      // setProfileData({ ...res.data.data });
      setAclData(res?.data?.data);
      // console.log(res.data)
    }
    // else {
    //   console.log(res.error);
    //   localStorage.clear();
    //   window.location.assign(`${BASE_URL_ESS}`);
    // }
  };
  const getProjects = async () => {
    const res = await getReq(`${apiLinks.pmt}/api/projects/getProjects?projectId=${projectId}`);
    if (res && !res.error) {
      setProjects(res.data.projects[0]);
    } else {
      console.log(res.error);
    }
  };

  useEffect(() => {
    getProjects();
  }, [projectId]);

  useEffect(() => {
    getAclData();
  }, []);
  // console.log(projects);

  return (
    <React.Fragment>
      {/* {firstStep} */}
      <div className={styles.projectContainer}>
        <div className={styles.projectName} onClick={() => navigateTo("/")}>
          <AiOutlineLeft />
          <span className={styles.projectNameText}>{projects && projects.name}</span>
        </div>
        <div className={styles.projectInsideContainer}>
          {innerLinks.map((curElem) => {
            if (curElem.visible && (aclData.includes(curElem?.accessName) || curElem?.accessName === "default")) {
              return (
                <div
                  className={curElem.active ? styles.projectInsideLinksActive : styles.projectInsideLinksInactive}
                  onClick={() => {
                    if (curElem.href === "pmt/project-discussion") {
                      window.location.assign(`${BASE_URL}/${curElem.href}`);
                    } else {
                      window.location.assign(`${BASE_URL}/${curElem.href}${projectIdForNav}`);
                    }
                  }}
                >
                  {curElem.icon}
                  <span className="w-100" style={{ marginLeft: "0.75rem" }}>
                    {curElem.label}
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AllProjectListPanel;
