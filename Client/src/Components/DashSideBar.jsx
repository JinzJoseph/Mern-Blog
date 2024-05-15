import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {HiUser,HiArrowSmRight} from "react-icons/hi"
import { Link, useLocation } from 'react-router-dom'

const DashSideBar = () => {
    const [tab, SetTab] = useState("");
    const location = useLocation();
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const TabFromuRL = urlParams.get("tab");
      console.log(TabFromuRL);
      SetTab(TabFromuRL);
    }, [location.search]);
  
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to="/dashboard?tab=profile">
                <Sidebar.Item active={tab==="profile"} icon={HiUser} label={"user" } labelColors="dark">
                Profile
                </Sidebar.Item>
                </Link>
                
                <Sidebar.Item active icon={HiArrowSmRight} className="cursor-pointer">
                    Sign out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar
