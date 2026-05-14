// UsersLayout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import UsersSidebar from "../components/UsersSidebar";
import Footer from "../components/Footer";

const UsersLayout = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />

      <main className="mx-auto max-w-7xl pt-28 pb-12 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          
          <UsersSidebar />

          <section className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <Outlet />
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UsersLayout;