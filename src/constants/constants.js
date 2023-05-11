import Homepage from "../Pages/Homepage/Homepage";

export const routingArray = [
  {
    forKey: 0,
    path: "/",
    element: <Homepage />,
  },
  {
    forKey: 0,
    path: "/:id",
    element: <Homepage />,
  },
];

export const apiLinks = {
  s3api: "https://s3-service.idesign.market",
  pmt: "https://pmt-api.essentiaenvironments.com",
  crm: "https://crm-api.essentiaenvironments.com",
};

export const BASE_URL = "https://erp.essentiaenvironments.com";

export const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
