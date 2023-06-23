import { MdOutlineDashboard, MdTimeline, MdOutlineSpaceDashboard } from "react-icons/md";
import { TbFolders, TbCurrencyRupee, TbReportAnalytics, TbUsers } from "react-icons/tb";
import { IoMdFolderOpen } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { RiChat1Line } from "react-icons/ri";
import { FaMoneyCheckAlt } from "react-icons/fa";
import design_quo_icon from "../AllProjectListPanel/InnerSidebarIcons/design_quo_icon.svg";

let BASE_URL = "https://pro.idesign.market";
export const sidebarLinks = [
  {
    label: "Dashboard",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#89c7ff",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MdOutlineDashboard />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/admin/`,
    accessName: "default",
  },
  {
    label: "Manage Leads",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#2CA9BC",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TbUsers />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/leads/`,
    accessName: "crm",
  },
  {
    label: "All Projects",
    // link: "/all-projects",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#ffe380",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TbFolders />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/pmt-beta/`,
    accessName: "pmt",
  },
  {
    label: "Design Quotation",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#197278",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={design_quo_icon} style={{ height: "18px" }} />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/quo-beta/enterprise-landing-page`,
    accessName: "quotation",
  },
  {
    label: "Quotation",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#f586ff",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TbCurrencyRupee />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/quo-beta/`,
    accessName: "quotation",
  },
  {
    label: "File Manager",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#ffbd70",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IoMdFolderOpen />
      </div>
    ),
    visible: true,
    active: true,
    href: `${BASE_URL}/file-beta/`,
    accessName: "fileManager",
  },
  {
    label: "Timelines",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#78f58c",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MdTimeline />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline-beta/timeline-dashboard`,
    accessName: "timelines",
  },
  {
    label: "Task Manager",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#B7094C",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CiViewList />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline-beta/task-manager-dashboard`,
    accessName: "taskManager",
  },
  {
    label: "MOM",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          fontSize: "10px",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#7fe8ff",
          color: "#ffffff",
        }}
      >
        MOM
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/mom/`,
    accessName: "mom",
  },
  {
    label: "Moodboard",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#247BA0",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MdOutlineSpaceDashboard />
      </div>
    ),
    visible: false,
    active: true,
    href: `${BASE_URL}/moodboard`,
  },
  {
    label: "Vendor & PO’s",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          fontSize: "10px",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#9296ff",
          color: "#ffffff",
        }}
      >
        PO
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/po-beta/`,
    accessName: "purchaseOrder",
  },

  {
    label: "Accounts",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#247BA0",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaMoneyCheckAlt />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/accounts-beta/`,
    accessName: "accounts",
  },
  {
    label: "Chat",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#c881ff",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RiChat1Line />
      </div>
    ),
    visible: false,
    active: false,
    href: "#",
  },
  {
    label: "Reports",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#5E548E",
          color: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TbReportAnalytics />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline-beta/dpr`,
    accessName: "reports",
  },
  {
    label: "Running Bill",
    link: "",
    icon: (
      <div
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: "#247BA0",
          color: "#ffffff",
          borderRadius: "4px",
          // marginRight:"12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaMoneyCheckAlt />
      </div>
    ),
    visible: false,
    active: false,
    href: `${BASE_URL}/running-bill/`,
  },
];
