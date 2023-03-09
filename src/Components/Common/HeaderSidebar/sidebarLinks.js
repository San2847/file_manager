import { MdOutlineDashboard, MdTimeline, MdOutlineSpaceDashboard } from "react-icons/md";
import { TbFolders, TbCurrencyRupee, TbReportAnalytics } from "react-icons/tb";
import { IoMdFolderOpen } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { RiChat1Line } from "react-icons/ri";

export const sidebarLinks = [
  {
    label: "Dashboard",
    link: "/",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#1B4332",
          color: "#ffffff",
          borderRadius: "50%",
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
    active: true,
    href: "/dashboard",
  },
  {
    label: "All Projects",
    link: "/all-projects",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#EF8354",
          color: "#ffffff",
          borderRadius: "50%",
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
    href: "/all-projects",
  },
  {
    label: "Quotation",
    link: "/quotation",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#7209B7",
          color: "#ffffff",
          borderRadius: "50%",
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
    href: "/quotation",
  },
  {
    label: "Files",
    link: "/files",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#F2B007",
          color: "#ffffff",
          borderRadius: "50%",
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
    active: false,
    href: "/files",
  },
  {
    label: "Timelines",
    link: "/timelines",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#718355",
          color: "#ffffff",
          borderRadius: "50%",
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
    href: "/timelines",
  },
  {
    label: "Task Manager",
    link: "/task-manager",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#B7094C",
          color: "#ffffff",
          borderRadius: "50%",
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
    href: "/task-manager",
  },
  {
    label: "MOM",
    link: "/mom",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          fontSize: "10px",
          borderRadius: "50%",
          marginRight: "0.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#3D348B",
          color: "#ffffff",
        }}
      >
        MOM
      </div>
    ),
    visible: true,
    active: false,
    href: "/mom",
  },
  {
    label: "Moodboard",
    link: "/moodboard",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#247BA0",
          color: "#ffffff",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "0.5rem",
        }}
      >
        <MdOutlineSpaceDashboard />
      </div>
    ),
    visible: true,
    active: false,
    href: "/moodboard",
  },
  {
    label: "Vendor & PO’s",
    link: "/vendor-po",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          fontSize: "10px",
          borderRadius: "50%",
          marginRight: "0.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EF233C",
          color: "#ffffff",
        }}
      >
        PO
      </div>
    ),
    visible: true,
    active: false,
    href: "/vendor-po",
  },
  {
    label: "Chat",
    link: "/chat",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#FF5D8F",
          color: "#ffffff",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "0.5rem",
        }}
      >
        <RiChat1Line />
      </div>
    ),
    visible: true,
    active: false,
    href: "/chat",
  },
  {
    label: "Reports",
    link: "/reports",
    icon: (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          backgroundColor: "#5E548E",
          color: "#ffffff",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "0.5rem",
        }}
      >
        <TbReportAnalytics />
      </div>
    ),
    visible: true,
    active: false,
    href: "/reports",
  },
];
