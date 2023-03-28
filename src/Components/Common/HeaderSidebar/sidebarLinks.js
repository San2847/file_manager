import { MdOutlineDashboard, MdTimeline, MdOutlineSpaceDashboard } from "react-icons/md";
import { TbFolders, TbCurrencyRupee, TbReportAnalytics } from "react-icons/tb";
import { IoMdFolderOpen } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { RiChat1Line } from "react-icons/ri";
import { FaMoneyCheckAlt } from "react-icons/fa";

let BASE_URL = "http://erp.essentiaenvironments.com";
export const sidebarLinks = [
  {
    label: "Manage Leads",
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
          marginRight: "0.5rem",
        }}
      >
        <MdOutlineDashboard />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/leads/`,
  },
  {
    label: "All Projects",
    link: "",
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
          marginRight: "0.5rem",
        }}
      >
        <TbFolders />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/pmt/`,
  },
  {
    label: "Design Quotation",
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
          marginRight: "0.5rem",
        }}
      >
        <TbCurrencyRupee />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/quotation/enterprise-landing-page`,
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
          marginRight: "0.5rem",
        }}
      >
        <TbCurrencyRupee />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/quotation/`,
  },
  {
    label: "Files",
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
          marginRight: "0.5rem",
        }}
      >
        <IoMdFolderOpen />
      </div>
    ),
    visible: true,
    active: true,
    href: "#",
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
          marginRight: "0.5rem",
        }}
      >
        <MdTimeline />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline/timeline-dashboard/`,
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
          marginRight: "0.5rem",
        }}
      >
        <CiViewList />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline/task-manager-dashboard/`,
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
          marginRight: "0.5rem",
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
          marginRight: "0.5rem",
        }}
      >
        <MdOutlineSpaceDashboard />
      </div>
    ),
    visible: false,
    active: false,
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
          marginRight: "0.5rem",
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
    href: `${BASE_URL}/po/`,
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
          marginRight: "0.5rem",
        }}
      >
        <FaMoneyCheckAlt />
      </div>
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/account/`,
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
          marginRight: "0.5rem",
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
          marginRight: "0.5rem",
        }}
      >
        <TbReportAnalytics />
      </div>
    ),
    visible: false,
    active: false,
    href: "#",
  },
];
