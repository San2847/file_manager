import Homepage from "../Pages/Homepage/Homepage";

export const routingArray = [
  {
    forKey: 0,
    path: "/",
    element: <Homepage />,
  },
];

export const apiLinks = {
  s3api: "https://s3-service.idesign.market",
  pmt: "http://pmt-api.essentiaenvironments.com",
  crm: "http://crm-api.essentiaenvironments.com",
};

export const BASE_URL = "http://erp.essentiaenvironments.com";

export const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
