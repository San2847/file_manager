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
import runningbill from "./InnerSidebarIcons/runningbill.svg";
import design_quotation_icon from "./InnerSidebarIcons/design_quotation_icon.svg";

let projectId = localStorage.getItem("projectId");
let BASE_URL = "http://erp.essentiaenvironments.com";
export const innerLinks = [
  {
    label: "Project Dashboard",
    link: "",
    icon: <img src={dashboard} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/project-dashboard/`,
    accessName: "default",
  },
  {
    label: "Updates",
    link: "",
    icon: <img src={updates} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/pmt/project-discussion`,
    accessName: "pmt",
  },
  {
    label: "File Manager",
    link: "",
    icon: <img src={files} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: true,
    href: `${BASE_URL}/file-manager/${localStorage.getItem("projectId")}`,
    accessName: "fileManager",
  },
  {
    label: "MOM",
    link: "",
    icon: <img src={mom} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/mom/${localStorage.getItem("projectId")}`,
    accessName: "mom",
  },
  // {
  //   label: "Design Quotation",
  //   link: "",
  //   icon: (
  //     <img
  //       src={design_quotation_icon}
  //       style={{ height: "28.8px", width: "28.8px" }}
  //     />
  //   ),
  //   visible: false,
  //   active: false,
  //   href: `${BASE_URL}/quotation/enterprise-landing-page`,
  //   accessName: "quotation",
  // },
  {
    label: "Quotation",
    link: "",
    icon: <img src={quotation} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/quotation/${localStorage.getItem("projectId")}`,
    accessName: "quotation",
  },
  {
    label: "Timelines",
    link: "",
    icon: <img src={timeline} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline/timeline/${localStorage.getItem("projectId")}`,
    accessName: "timelines",
  },
  {
    label: "Task Manager",
    link: "",
    icon: (
      <img src={taskmanager} style={{ height: "28.8px", width: "28.8px" }} />
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline/task-manager/${localStorage.getItem(
      "projectId"
    )}`,
    accessName: "taskManager",
  },
  {
    label: "Accounts",
    link: "",
    icon: <img src={accounts} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/account/account/${localStorage.getItem("projectId")}`,
    accessName: "accounts",
  },
  {
    label: "Moodboard",
    link: "",
    icon: <img src={moodboard} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: false,
    active: false,
    href: `${BASE_URL}/moodboard`,
  },
  {
    label: "Vendor & PO’s",
    link: "",
    icon: <img src={po} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/po/single-project/${localStorage.getItem("projectId")}`,
    accessName: "purchaseOrder",
  },

  {
    label: "Running Bill",
    link: "",
    icon: (
      <img src={runningbill} style={{ height: "28.8px", width: "28.8px" }} />
    ),
    visible: true,
    active: false,
    href: `${BASE_URL}/running-bill/`,
    accessName: "runningBill",
  },

  {
    label: "Reports",
    link: "",
    icon: <img src={reports} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `${BASE_URL}/timeline/dpr/${localStorage.getItem("projectId")}`,
    accessName: "reports",
  },
];
