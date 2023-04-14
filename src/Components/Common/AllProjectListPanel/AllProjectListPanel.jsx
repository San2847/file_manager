import React, { useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import styles from "./allProjectListPanel.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { innerLinks } from "./innerLinks";
import { getReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";

const AllProjectListPanel = ({ projectId }) => {
  const navigateTo = useNavigate();
  const [projects, setProjects] = useState([]);

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
            if (curElem.visible) {
              return (
                <div className={curElem.active ? styles.projectInsideLinksActive : styles.projectInsideLinksInactive} onClick={() => window.location.assign(curElem.href)}>
                  {curElem.icon}
                  <span className="w-100 ps-3">{curElem.label}</span>
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
