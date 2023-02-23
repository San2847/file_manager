import React, { useEffect, useState } from "react";
import HomepageMob from "./HomepageMob/HomepageMob";
import HomepageWeb from "./HomepageWeb/HomepageWeb";

const Homepage = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 767);
  const updateMedia = () => {
    setIsDesktop(window.innerWidth > 767);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
  return <>{isDesktop ? <HomepageWeb /> : <HomepageMob />}</>;
};

export default Homepage;
