import React from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import Loading from "../../components/Loading";
import BlurCircle from "../../components/BlurCircle";

const Layout = () => {
  document.body.classList.add("overflow-hidden");

  // useEffect(() => {
  //   fetchIsAdmin();
  // }, []);

  return (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <BlurCircle top="80px" left="300px" />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
