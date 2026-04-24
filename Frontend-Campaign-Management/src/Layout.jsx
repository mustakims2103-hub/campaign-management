import React from "react";
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import { Outlet } from "react-router";


function Layout() {


  return (
    <div className="flex min-h-screen bg-gray-100">
      

      <Navbar />

 
      <div className="flex-1 ml-50 flex flex-col">
      
        <Header />

        
        <main className="flex-1 overflow-y-scroll p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
