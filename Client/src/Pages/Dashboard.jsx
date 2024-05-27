import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar";
import DashProfile from "../Components/DashProfile";
import DashPost from "../Components/DashPost";
import UserList from "./UserList";
import CommentsList from "../Components/CommentsList";
import AdminDash from "../Components/AdminDash";
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
      {/* comments */}
      {tab==="comments" && <CommentsList/> }
      {/* dash of admin */}
      { tab==="dash" && <AdminDash/>}
    </div>
  );
};

export default Dashboard;
