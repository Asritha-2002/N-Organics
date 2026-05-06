import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import UserSearchBar from "./UserSearchBar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Filter states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${BASE_URL}/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and Search logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase());

    let matchesFilter = true;
    if (filter === "active") {
      matchesFilter = user.isActive === true || user.status === "active";
    } else if (filter === "inactive") {
      matchesFilter = user.isActive === false || user.status === "inactive";
    }

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-4">
            <FaUsers className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Users
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-indigo-500 shadow-lg">
              <FaUsers className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                All registered users information
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
       <div className="mx-3">
         <UserSearchBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
       </div>

        {/* User Listings */}
       <div className="px-3">
         {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No users found
            </h3>
            <p className="text-gray-500">There are no users to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {(user.name || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {user.name || "Unnamed User"}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Phone</span>
                    <span className="font-semibold text-gray-700">
                      {user.phone || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Joined</span>
                    <span className="font-semibold text-gray-700">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
       </div>
      </div>
    </div>
  );
}