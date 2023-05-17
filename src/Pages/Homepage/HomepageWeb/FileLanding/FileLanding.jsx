import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../Components/Common/Breadcrumb/Breadcrumb";
import styles from "./fileLanding.module.css";
import task from "../../../../Assets/task.svg";
import rate_review from "../../../../Assets/rate_review.svg";
import { BsSearch } from "react-icons/bs";
import { Table } from "react-bootstrap";
import { getReq } from "../../../../Services/api";
import { apiLinks } from "../../../../constants/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveProjectId } from "../../../../Redux/slices/filemanagerSlice";
import { AiOutlineClose } from "react-icons/ai";

const FileLanding = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [projectFileData, setProjectFileData] = useState([]);
  const [filteredProjectData, setFilteredProjectData] = useState([]);
  const getProjectFileData = async () => {
    const res = await getReq(
      `${apiLinks.pmt}/api/file-manager/details-with-project`
    );
    if (res && !res.error) {
      setProjectFileData([...res.data]);
    } else {
      console.log(res.error);
    }
  };

  const [showInput, setShowInput] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getProjectFileData();
  }, []);
  useEffect(() => {
    if (searchText) {
      let x = projectFileData.filter((curElem) => {
        return curElem.projectName.startsWith(searchText);
      });
      setFilteredProjectData([...x]);
    } else {
      setFilteredProjectData([...projectFileData]);
    }
  }, [searchText, projectFileData]);
  return (
    <div className={styles.container}>
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <div className={styles.filesHeading}>Files</div>
        </div>
        <div className="d-flex align-items-start">
          <Breadcrumb
            pathArr={JSON.stringify([
              { label: "Home", link: "" },
              { label: "Files", navTo: "" }
            ])}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {/* <div className={styles.blueStripe}>
          <div>PROJECT LIST</div>
          <div className="d-flex align-items-center">
            {showInput && (
              <div className={styles.searchInput}>
                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </div>
            )}
            <div
              onClick={() => setShowInput(!showInput)}
              className={
                showInput ? styles.searchActive : styles.searchInactive
              }
            >
              {showInput ? <AiOutlineClose /> : <BsSearch />}
            </div>
          </div>
        </div> */}
        <div className={styles.tableHere}>
          <Table bordered hover>
            <thead>
              <tr>
                <th style={{ fontSize: "14px", width: '25%' }}>PROJECT NAME</th>
                <th style={{ fontSize: "14px" }}>TOTAL FILES</th>
                <th style={{ fontSize: "14px" }}>APPROVED</th>
                <th style={{ fontSize: "14px" }}>IN-DISCUSSION</th>
                <th style={{ fontSize: "14px" }}>IN-EXECUTION</th>
                <th
                  style={{ fontSize: "14px" }}
                  className="d-flex justify-content-center"
                >
                  Recent Activity
                </th>
                <th style={{ fontSize: "14px" }}>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjectData &&
                filteredProjectData.map((curElem) => {
                  console.log(curElem);
                  return (
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(saveProjectId(curElem.projectId));
                        navigateTo(`/${curElem.projectId}`);
                      }}
                    >
                      <td>{curElem.projectName}</td>
                      <td style={{ textAlign: 'center' }}>{curElem.allFiles}</td>
                      <td style={{ textAlign: 'center' }}>{curElem.approvedFiles}</td>
                      <td style={{ textAlign: 'center' }}>{curElem.inDiscussion}</td>
                      <td style={{ textAlign: 'center' }}>{curElem.inExecution}</td>
                      <td className="d-flex justify-content-between">
                        <div>
                          <img src={rate_review} alt="" style={{ marginRight: "0.5rem" }} />
                          <span style={{ fontWeight: 500, fontSize: "12px" }}>
                            <span style={{ paddingRight: '2px' }}>{curElem.inExecution}</span>
                            {"Feedback"}
                          </span>
                        </div>
                        <div>
                          <img src={task} alt="" style={{ marginRight: "0.5rem" }} />
                          <span style={{ fontWeight: 500, fontSize: "12px" }}>
                            <span style={{ paddingRight: '2px' }}> {curElem.inExecution}</span>
                            {"Approval"}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{curElem.inExecution}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FileLanding;
