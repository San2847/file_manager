import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import styles from "./shareModal.module.css";
import mailIcon from "../../../Assets/ShareModalIcons/mailIcon.svg";
import whatsapp from "../../../Assets/ShareModalIcons/whatsapp.svg";
import person from "../../../Assets/ShareModalIcons/person.svg";
import team from "../../../Assets/ShareModalIcons/team.svg";
import { setModalState } from "../../../Redux/slices/filemanagerSlice";
import { postReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";

const ShareModal = () => {
  const dispatch = useDispatch();
  const { shareModal, filesToBeSharedArr, profileData, teamMemberArray } = useSelector((state) => state.filemanager);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy Link");

  const linkTextRef = useRef(null);

  const [selectedTeamMember, setSelectedTeamMember] = useState({});

  const shareToTeam = async (fileObj) => {
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/share-file?id=${fileObj.container._id}&fileId=${fileObj.file._id}`, { userId: selectedTeamMember.memberId });
    if (res && !res.error) {
      setShowDropdown(false);
      dispatch(setModalState({ modal: "shareModal", state: false }));
    } else {
      console.log(res.error);
    }
  };
  const shareToTeamClick = () => {
    setShowDropdown(true);
    if (showDropdown && Object.keys(selectedTeamMember).length > 0) {
      filesToBeSharedArr.forEach((curElem) => {
        shareToTeam(curElem);
      });
    }
  };

  const copyText = () => {
    const text = linkTextRef.current.innerText;
    navigator.clipboard.writeText(text);
    setCopyButtonText("Copied");
  };
  useEffect(() => {
    setCopyButtonText("Copy Link")
  }, [shareModal])

  const goToWhtsapp = () => {
    const data = filesToBeSharedArr.map((item) => item.file.fileLink).join(' , ')
    console.log(data)
    let url = "https://wa.me?text=" + data; window.open(url, "_blank").focus()
  }
  console.log(filesToBeSharedArr)
  return (
    <Modal show={shareModal} centered>
      <Modal.Body>
        <div className="d-flex justify-content-between">
          <div className={styles.heading}>Share</div>
          <div style={{ cursor: "pointer" }} onClick={() => dispatch(setModalState({ modal: "shareModal", state: false }))}>
            <AiOutlineClose />
          </div>
        </div>
        {filesToBeSharedArr?.length <= 1 ?
          <div className={styles.linkContainerDiv}>
            <div style={{ whiteSpace: "nowrap", overflow: "scroll", width: "78%" }} ref={linkTextRef}>
              {filesToBeSharedArr &&
                filesToBeSharedArr.map((curElem, index) => {
                  if (index === filesToBeSharedArr.length - 1) {
                    return `${curElem.file.fileLink}`;
                  } else {
                    return `${curElem.file.fileLink},`;
                  }
                })}
            </div>
            <button onClick={copyText}>{copyButtonText}</button>
          </div>
          : ""
        }

        {showDropdown && (
          <Dropdown>
            <Dropdown.Toggle className={styles.teamSelectDrop}>{Object.keys(selectedTeamMember).length > 0 ? selectedTeamMember.memberName : "Select"}</Dropdown.Toggle>
            <Dropdown.Menu>
              {teamMemberArray &&
                teamMemberArray.map((curElem) => {
                  return <Dropdown.Item onClick={() => setSelectedTeamMember(curElem)}>{curElem.memberName}</Dropdown.Item>;
                })}
            </Dropdown.Menu>
          </Dropdown>
        )}
        <div className="d-flex">
          <div className={styles.eachIconContainer}>
            <img src={mailIcon} alt="" />
            <div>E-Mail</div>
          </div>
          <div className={styles.eachIconContainer}>
            <img src={whatsapp} alt="" onClick={goToWhtsapp} />
            <div>Whatsapp</div>
          </div>
          <div className={styles.eachIconContainer}>
            <img src={person} alt="" />
            <div>Client</div>
          </div>
          <div className={styles.eachIconContainer} onClick={shareToTeamClick}>
            <img src={team} alt="" />
            <div>Internal Team</div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
