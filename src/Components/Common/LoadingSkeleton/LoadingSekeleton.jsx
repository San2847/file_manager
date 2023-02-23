import React from "react";
import styles from "./loadingSkeleton.module.css";

const LoadingSekeleton = () => {
  return (
    <>
      <div className={styles.eachSkeleton}></div>
      <div className={styles.eachSkeleton}></div>
      <div className={styles.eachSkeleton}></div>
      <div className={styles.eachSkeleton}></div>
      <div className={styles.eachSkeleton}></div>
      <div className={styles.eachSkeleton}></div>
    </>
  );
};

export default LoadingSekeleton;
