import React, { useEffect, useState } from "react";
import { FaUsers, FaStar, FaTimes } from "react-icons/fa";
import UserSearchBar from "./UserSearchBar";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
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

const handleReviewAction = async (reviewId, action) => {
  try {
    const token = localStorage.getItem("token");

    const status = action === "approve" ? "approved" : "denied";

    const response = await fetch(`${BASE_URL}/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to ${action} review`);
    }

    const updatedReviews = selectedReviews.filter(
      (review) => review._id !== reviewId
    );
    setSelectedReviews(updatedReviews);

    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        reviews: (user.reviews || []).filter((review) => review._id !== reviewId),
      }))
    );
toast.success(`Review is ${status} successfully!`)
    if (updatedReviews.length === 0) {
      closeDrawer();
    }
  } catch (err) {
    console.error(`Error trying to ${action} review:`, err);
    toast.error(err.message || `Failed to ${action} review`);
  }
};

  const openDrawer = (user, reviews) => {
    setSelectedUser(user);
    setSelectedReviews(reviews);
    setIsDrawerOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
    setSelectedReviews([]);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
          <p className="mt-4 font-medium text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <FaUsers className="text-3xl text-red-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Unable to Load Users
          </h2>
          <p className="mb-6 text-gray-500">{error}</p>
          <button
            onClick={fetchUsers}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white transition hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background font-inter">
        <div className="space-y-8">
          <div className="border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-green-500 to-indigo-500 p-3 shadow-lg">
                <FaUsers className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  User Management
                </h1>
                <p className="mt-1 text-gray-600">
                  All registered users information
                </p>
              </div>
            </div>
          </div>

          <div className="mx-3">
            <UserSearchBar
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
            />
          </div>

          <div className="px-3">
            {filteredUsers.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white py-16 text-center shadow-sm">
                <h3 className="mb-1 text-lg font-semibold text-gray-800">
                  No users found
                </h3>
                <p className="text-gray-500">There are no users to display.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {filteredUsers.map((user) => {
                  const pendingReviews = (user.reviews || []).filter(
                    (review) => review.status === "pending"
                  );

                  const pendingCount = pendingReviews.length;

                  return (
                    <div
                      key={user._id}
                      className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
                          {(user.name || "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-gray-800">
                            {user.name || "Unnamed User"}
                          </h3>
                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 border-b border-gray-100 pb-4">
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

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Pending Reviews</span>
                          <span className="font-semibold text-amber-600">
                            {pendingCount}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">
                            Pending Review Requests
                          </h4>
                          <p className="text-xs text-gray-500">
                            {pendingCount > 0
                              ? `${pendingCount} pending review${
                                  pendingCount > 1 ? "s" : ""
                                } found`
                              : "No pending reviews"}
                          </p>
                        </div>

                        {pendingCount > 0 && (
                          <button
                            onClick={() => openDrawer(user, pendingReviews)}
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                          >
                            View Reviews
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Right Drawer Modal */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Pending Reviews
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {selectedUser?.name || "User"} pending review submissions
            </p>
          </div>

          <button
            onClick={closeDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {selectedReviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
              No pending reviews available.
            </div>
          ) : (
            <div className="space-y-4">
              {selectedReviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        {review.productId?.name || "Unknown Product"}
                      </h5>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-amber-500">
                        {review.status || "pending"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                      <FaStar className="text-xs" />
                      {review.rating || 0}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Headline
                      </span>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {review.headline || "-"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Review
                      </span>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {review.review || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReviewAction(review._id, "approve")}
                      className="cursor-pointer rounded bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReviewAction(review._id, "deny")}
                      className="cursor-pointer rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}