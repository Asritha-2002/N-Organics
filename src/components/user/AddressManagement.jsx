import React, { useEffect, useState } from "react";
import {
  Home,
  Building2,
  Plus,
  ChevronLeft,
  MapPin,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const InputField = ({
  label,
  name,
  placeholder,
  required = false,
  type = "text",
  value,
  onChange,
  maxLength,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#457358] focus:ring-4 focus:ring-[#457358]/10"
      />
    </div>
  );
};

const ConfirmDeleteModal = ({
  open,
  address,
  deleting,
  onClose,
  onConfirm,
}) => {
  if (!open || !address) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Delete Address</h3>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-gray-700">
            Are you sure you want to delete this address for{" "}
            <span className="font-semibold text-gray-900">
              {address.name || "this user"}
            </span>
            ?
          </p>

          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <p>{address.addl1}</p>
            <p className="mt-1">
              {address.city}, {address.state} - {address.pincode}
            </p>
            <p className="mt-1">{address.country}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressManagement = () => {
  const initialFormData = {
    name: "",
    mobilenum: "",
    addl1: "",
    country: "India",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    type: "Home",
    isDefault: false,
  };

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setFetching(true);

      const response = await fetch(`${BASE_URL}/addresses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAddresses(
          Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        );
      } else {
        toast.error(data.message || "Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setFetching(false);
    }
  };

  const resetFormState = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
    setEditAddressId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
    setEditAddressId(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setFormData({
      name: address.name || "",
      mobilenum: address.mobilenum || "",
      addl1: address.addl1 || "",
      country: address.country || "India",
      landmark: address.landmark || "",
      pincode: address.pincode || "",
      city: address.city || "",
      state: address.state || "",
      type: address.type || "Home",
      isDefault: address.isDefault || false,
    });

    setEditAddressId(address._id);
    setIsEditMode(true);
    setShowForm(true);
  };

  const openDeleteModal = (address) => {
    setSelectedAddress(address);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setSelectedAddress(null);
  };

  const handleDeleteAddress = async () => {
    if (!selectedAddress?._id) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${BASE_URL}/addresses/${selectedAddress._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Address deleted successfully!");
        setShowDeleteModal(false);
        setSelectedAddress(null);
        fetchAddresses();
      } else {
        toast.error(data.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("An error occurred while deleting the address");
    } finally {
      setDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedValue = value;

    if (name === "mobilenum") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "pincode") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : updatedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode
        ? `${BASE_URL}/addresses/${editAddressId}`
        : `${BASE_URL}/addresses`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEditMode
            ? "Address updated successfully!"
            : "Address saved successfully!"
        );

        resetFormState();
        fetchAddresses();
      } else {
        toast.error(data.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("An error occurred while saving the address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto py-2 ">
   
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            {!showForm ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your saved delivery addresses.
                </p>
              </div>
            ) : (
              <button
                onClick={resetFormState}
                className="inline-flex items-center gap-2 text-base font-semibold text-gray-900 transition hover:text-[#457358]"
              >
                <ChevronLeft size={20} />
                Back to Addresses
              </button>
            )}
          </div>

          <div className="p-6">
            {!showForm ? (
              <div className="space-y-5">
                {fetching ? (
                  <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-500">
                    Loading addresses...
                  </div>
                ) : addresses.length === 0 ? (
                  <>
                    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#457358]/10 text-[#457358]">
                        <MapPin size={26} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        No address found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add your address to make checkout faster and easier.
                      </p>
                    </div>

                    <button
                      onClick={handleAddNew}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#457358] bg-white px-6 py-4 font-semibold text-[#457358] transition hover:bg-[#457358] hover:text-white"
                    >
                      <Plus size={20} />
                      Add New Address
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-2 rounded-full bg-[#457358]/10 px-3 py-1 text-xs font-semibold text-[#457358]">
                                {address.type === "Office" ? (
                                  <Building2 size={14} />
                                ) : (
                                  <Home size={14} />
                                )}
                                {address.type}
                              </span>

                              {address.isDefault && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                  <Star size={12} />
                                  Default
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(address)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-[#457358] hover:text-[#457358]"
                                title="Edit address"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => openDeleteModal(address)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-500 hover:text-red-600"
                                title="Delete address"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <h3 className="text-base font-bold text-gray-900">
                              {address.name || "Address"}
                            </h3>

                            <p className="text-sm text-gray-600">
                              {address.mobilenum}
                            </p>

                            <p className="text-sm leading-6 text-gray-700">
                              {address.addl1}
                              {address.landmark ? `, ${address.landmark}` : ""}
                              {address.city ? `, ${address.city}` : ""}
                              {address.state ? `, ${address.state}` : ""}
                              {address.pincode ? ` - ${address.pincode}` : ""}
                              {address.country ? `, ${address.country}` : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleAddNew}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#457358] bg-white px-6 py-4 font-semibold text-[#457358] transition hover:bg-[#457358] hover:text-white"
                    >
                      <Plus size={20} />
                      Add Another Address
                    </button>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {isEditMode ? "Edit Address" : "Add New Address"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isEditMode
                      ? "Update your saved address details."
                      : "Fill in the address details below."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />

                  <InputField
                    label="Mobile Number"
                    name="mobilenum"
                    value={formData.mobilenum}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    required
                    type="tel"
                    maxLength={10}
                  />

                  <InputField
                    label="Address Line 1"
                    name="addl1"
                    value={formData.addl1}
                    onChange={handleInputChange}
                    placeholder="House no., flat no., street"
                    required
                  />

                  <InputField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    required
                  />

                  <InputField
                    label="Landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby landmark"
                  />

                  <InputField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    required
                    maxLength={6}
                  />

                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />

                  <InputField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Address Type
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: "Home" }))
                      }
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                        formData.type === "Home"
                          ? "bg-[#457358] text-white shadow-sm"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-[#457358]"
                      }`}
                    >
                      <Home size={18} />
                      Home
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: "Office" }))
                      }
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                        formData.type === "Office"
                          ? "bg-[#457358] text-white shadow-sm"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-[#457358]"
                      }`}
                    >
                      <Building2 size={18} />
                      Office
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="isDefault"
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#457358] focus:ring-[#457358]"
                  />
                  <label
                    htmlFor="isDefault"
                    className="text-sm font-medium text-gray-700"
                  >
                    Set as default address
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetFormState}
                    className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-[#143c2f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2e24] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {loading
                      ? isEditMode
                        ? "Updating..."
                        : "Saving..."
                      : isEditMode
                      ? "Update Address"
                      : "Save Address"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
     

      <ConfirmDeleteModal
        open={showDeleteModal}
        address={selectedAddress}
        deleting={deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteAddress}
      />
    </>
  );
};

export default AddressManagement;