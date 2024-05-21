import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight, HiDocumentText } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const DashSideBar = () => {
  const [tab, SetTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const TabFromuRL = urlParams.get("tab");
    console.log(TabFromuRL);
    SetTab(TabFromuRL);
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "user"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColors="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                labelColors="dark"
                icon={HiDocumentText}
                as="div"
                active={tab === "posts"}
              >
                post
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSideBar;
