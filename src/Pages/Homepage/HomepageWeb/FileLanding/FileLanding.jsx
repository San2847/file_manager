import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../Components/Common/Breadcrumb/Breadcrumb";
import styles from "./fileLanding.module.css";
import { BsSearch } from "react-icons/bs";
import { Table } from "react-bootstrap";
import { getReq } from "../../../../Services/api";
import { apiLinks } from "../../../../constants/constants";
import { useNavigate } from "react-router-dom";

const FileLanding = () => {
  const navigateTo = useNavigate();
  const [projectFileData, setProjectFileData] = useState([]);
  const [filteredProjectData, setFilteredProjectData] = useState([]);
  const getProjectFileData = async () => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/details-with-project`);
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
    let x = projectFileData.filter((curElem) => {
      return curElem.projectName.startsWith(searchText);
    });
    setFilteredProjectData([...x]);
  }, [searchText]);
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
              { label: "Files", navTo: "" },
            ])}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.blueStripe}>
          <div>PROJECT LIST</div>
          <div className="d-flex align-items-center">
            {showInput && (
              <div className={styles.searchInput}>
                <input type="text" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
              </div>
            )}
            <div onClick={() => setShowInput(!showInput)} className={showInput ? styles.searchActive : styles.searchInactive}>
              <BsSearch />
            </div>
          </div>
        </div>
        <div className={styles.tableHere}>
          <Table bordered hover>
            <thead>
              <tr>
                <th style={{ fontSize: "14px" }}>PROJECT NAME</th>
                <th style={{ fontSize: "14px" }}>TOTAL FILES</th>
                <th style={{ fontSize: "14px" }}>APPROVED</th>
                <th style={{ fontSize: "14px" }}>IN-DISCUSSION</th>
                <th style={{ fontSize: "14px" }}>IN-EXECUTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjectData &&
                filteredProjectData.map((curElem) => {
                  return (
                    <tr style={{ cursor: "pointer" }} onClick={() => navigateTo(`/${curElem.projectId}`)}>
                      <td>{curElem.projectName}</td>
                      <td>{curElem.allFiles}</td>
                      <td>{curElem.approvedFiles}</td>
                      <td>{curElem.inDiscussion}</td>
                      <td>{curElem.inExecution}</td>
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
