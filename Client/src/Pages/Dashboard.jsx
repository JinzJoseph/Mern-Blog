import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar";
import DashProfile from "../Components/DashProfile";
const Dashboard = () => {
  const [tab, SetTab] = useState("");
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const TabFromuRL = urlParams.get("tab");
    console.log(TabFromuRL);
    SetTab(TabFromuRL);
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar */}

        <DashSideBar />
      </div>

      {/* profile */}
      {tab === "profile" && <DashProfile />}
    </div>
  );
};

export default Dashboard;
