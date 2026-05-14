import { useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";

// AdminLayout.js
const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden"> {/* Use h-screen + overflow-hidden to prevent body scroll */}
      
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      {/* Add min-w-0 here to allow internal scrolling */}
      <div className="flex-1 flex flex-col min-w-0 h-full"> 
        <AdminNavbar toggleSidebar={() => setIsOpen(!isOpen)} />

        {/* Change overflow-x-hidden to overflow-hidden or overflow-x-auto */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-4 sm:p-6 scroll-smooth">
          <div className="max-w-full"> {/* Inner constraint */}
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;