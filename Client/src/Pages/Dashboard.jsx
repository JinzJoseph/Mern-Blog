import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar";
import DashProfile from "../Components/DashProfile";
import DashPost from "../Components/DashPost";
import UserList from "./UserList";
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

      {/* post */}
      {tab === "posts" && <DashPost />}
      {/* users */}
      {tab === "users" && <UserList />}
    </div>
  );
};

export default Dashboard;
