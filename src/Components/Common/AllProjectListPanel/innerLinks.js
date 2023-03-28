import dashboard from "./InnerSidebarIcons/dashboard.svg";
import updates from "./InnerSidebarIcons/updates.svg";
import files from "./InnerSidebarIcons/files.svg";
import mom from "./InnerSidebarIcons/mom.svg";
import quotation from "./InnerSidebarIcons/quotation.svg";
import timeline from "./InnerSidebarIcons/timeline.svg";
import taskmanager from "./InnerSidebarIcons/taskmanager.svg";
import accounts from "./InnerSidebarIcons/accounts.svg";
import moodboard from "./InnerSidebarIcons/moodboard.svg";
import po from "./InnerSidebarIcons/po.svg";
import reports from "./InnerSidebarIcons/reports.svg";

let projectId = localStorage.getItem("projectId");
let BASE_URL = "http://erp.essentiaenvironments.com";
export const innerLinks = [
  {
    label: "Dashboard",
    link: "",
    icon: <img src={dashboard} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/pmt/`,
  },
  {
    label: "Updates",
    link: "/project-discussion",
    icon: <img src={updates} />,
    visible: true,
    active: true,
    href: "",
  },
  {
    label: "Files",
    link: "",
    icon: <img src={files} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/file-manager/${projectId}`,
  },
  {
    label: "MOM",
    link: "",
    icon: <img src={mom} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/mom/${projectId}`,
  },
  {
    label: "Quotation",
    link: "",
    icon: <img src={quotation} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/quotation/${projectId}`,
  },
  {
    label: "Timelines",
    link: "",
    icon: <img src={timeline} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline/timeline-dashboard/`,
  },
  {
    label: "Task Manager",
    link: "",
    icon: <img src={taskmanager} />,
    visible: false,
    active: false,
    href: `${BASE_URL}/timeline/task-manager-dashboard/`,
  },
  {
    label: "Accounts",
    link: "",
    icon: <img src={accounts} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/account/`,
  },
  {
    label: "Moodboard",
    link: "",
    icon: <img src={moodboard} />,
    visible: false,
    active: false,
    href: `${BASE_URL}/moodboard`,
  },
  {
    label: "Vendor & PO’s",
    link: "",
    icon: <img src={po} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/po/`,
  },

  {
    label: "Reports",
    link: "",
    icon: <img src={reports} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/account/`,
  },
];
