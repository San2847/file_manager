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
    href: `project-dashboard/`,
    accessName: "default",
  },
  {
    label: "Updates",
    link: "",
    icon: <img src={updates} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `pmt/project-discussion`,
    accessName: "pmt",
  },
  {
    label: "File Manager",
    link: "",
    icon: <img src={files} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: true,
    href: `file-manager/`,
    accessName: "fileManager",
  },
  {
    label: "MOM",
    link: "",
    icon: <img src={mom} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `mom/`,
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
  //   href: `quotation/enterprise-landing-page`,
  //   accessName: "quotation",
  // },
  {
    label: "Quotation",
    link: "",
    icon: <img src={quotation} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `quotation/`,
    accessName: "quotation",
  },
  {
    label: "Timelines",
    link: "",
    icon: <img src={timeline} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `timeline/timeline/`,
    accessName: "timelines",
  },
  {
    label: "Task Manager",
    link: "",
    icon: <img src={taskmanager} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `timeline/task-manager/`,
    accessName: "taskManager",
  },
  {
    label: "Accounts",
    link: "",
    icon: <img src={accounts} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `account/account/`,
    accessName: "accounts",
  },
  {
    label: "Moodboard",
    link: "",
    icon: <img src={moodboard} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: false,
    active: false,
    href: `moodboard`,
  },
  {
    label: "Vendor & PO’s",
    link: "",
    icon: <img src={po} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `po/single-project/`,
    accessName: "purchaseOrder",
  },

  {
    label: "Running Bill",
    link: "",
    icon: <img src={runningbill} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `running-bill/`,
    accessName: "runningBill",
  },

  {
    label: "Reports",
    link: "",
    icon: <img src={reports} style={{ height: "28.8px", width: "28.8px" }} />,
    visible: true,
    active: false,
    href: `timeline/dpr/`,
    accessName: "reports",
  },
];
