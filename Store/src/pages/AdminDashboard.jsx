import React, { useState, useEffect } from "react";
import { Users, Store, BarChart3, Eye, X } from "lucide-react";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import SearchFilter from "../components/SearchFilter";
import ProfileTab from "../components/ProfileTab";
import {
  getUsers,
  getStores,
  getRatings,
  addUser,
  addStore,
} from "../services/dataService";
import { validateForm } from "../utils/validation";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [userData, storeData, ratingData] = await Promise.all([
      getUsers(),
      getStores(),
      getRatings(),
    ]);
    setUsers(userData);
    setStores(storeData);
    setRatings(ratingData);
  };

  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 card-hover group">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Users className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
              {users.length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 card-hover group">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Store className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Stores</p>
            <p className="text-3xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors duration-300">
              {stores.length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 card-hover group">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <BarChart3 className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Ratings</p>
            <p className="text-3xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors duration-300">
              {ratings.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const AddUserForm = () => {
    const [errors, setErrors] = useState({});
    const [userFormData, setUserFormData] = useState({
      addName: "",
      addEmail: "",
      addAddress: "",
      addPassword: "",
      addRole: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddUser = async (e) => {
      e.preventDefault();

      const validationErrors = validateForm(userFormData, "addUser");
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const newUser = await addUser({
          name: userFormData.addName,
          email: userFormData.addEmail,
          address: userFormData.addAddress,
          role: userFormData.addRole,
        });

        setUsers([...users, newUser]);
        setUserFormData({
          addName: "",
          addEmail: "",
          addAddress: "",
          addPassword: "",
          addRole: "",
        });
        setErrors({});
        alert("User added successfully!");
      } catch (error) {
        console.log(error);

        alert("Failed to add user. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Add New User
          </h3>
        </div>
        <form
          onSubmit={handleAddUser}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            label="Name"
            placeholder="Full name (5-40 characters)"
            value={userFormData.addName}
            onChange={(e) =>
              setUserFormData({ ...userFormData, addName: e.target.value })
            }
            error={errors.name}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="Email address"
            value={userFormData.addEmail}
            onChange={(e) =>
              setUserFormData({ ...userFormData, addEmail: e.target.value })
            }
            error={errors.email}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Address"
              type="textarea"
              placeholder="Address (max 400 characters)"
              value={userFormData.addAddress}
              onChange={(e) =>
                setUserFormData({ ...userFormData, addAddress: e.target.value })
              }
              error={errors.address}
              required
              rows={2}
            />
          </div>

          <Input
            label="Password"
            type="password"
            placeholder="Password"
            value={userFormData.addPassword}
            onChange={(e) =>
              setUserFormData({ ...userFormData, addPassword: e.target.value })
            }
            error={errors.password}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Role *
            </label>
            <div className="relative">
              <select
                required
                className={`w-full px-4 py-3.5 pr-12 border rounded-xl bg-white/90 backdrop-blur-sm transition-all duration-300 text-slate-700 hover:border-slate-300 focus:ring-4 shadow-md focus:shadow-lg appearance-none cursor-pointer ${
                  errors.role
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
                value={userFormData.addRole}
                onChange={(e) => {
                  setUserFormData({ ...userFormData, addRole: e.target.value });
                  if (errors.role) {
                    setErrors({ ...errors, role: '' });
                  }
                }}
              >
                <option value="">Select Role</option>
                <option value="Normal User">Normal User</option>
                <option value="Store Owner">Store Owner</option>
                <option value="System Administrator">
                  System Administrator
                </option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.role && (
              <p className="text-red-600 text-sm mt-2 flex items-center animate-slide-up">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                {errors.role}
              </p>
            )}
          </div>

          <div className="md:col-span-2 mt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              size="large"
              className="w-full"
              variant="success"
            >
              Add User
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const AddStoreForm = () => {
    const [errors, setErrors] = useState({});
    const [storeFormData, setStoreFormData] = useState({
      addStoreName: "",
      addStoreEmail: "",
      addStoreAddress: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddStore = async (e) => {
      e.preventDefault();

      const validationErrors = validateForm(storeFormData, "addStore");
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const newStore = await addStore({
          name: storeFormData.addStoreName,
          email: storeFormData.addStoreEmail,
          address: storeFormData.addStoreAddress,
        });

        setStores([...stores, newStore]);
        setStoreFormData({
          addStoreName: "",
          addStoreEmail: "",
          addStoreAddress: "",
        });
        setErrors({});
        alert("Store added successfully!");
      } catch (error) {
        console.log(error);
        alert("Failed to add store. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Add New Store
          </h3>
        </div>
        <form
          onSubmit={handleAddStore}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            label="Store Name"
            placeholder="Store name (5-40 characters)"
            value={storeFormData.addStoreName}
            onChange={(e) =>
              setStoreFormData({ ...storeFormData, addStoreName: e.target.value })
            }
            error={errors.name}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="Store email address"
            value={storeFormData.addStoreEmail}
            onChange={(e) =>
              setStoreFormData({ ...storeFormData, addStoreEmail: e.target.value })
            }
            error={errors.email}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Address"
              type="textarea"
              placeholder="Store address (max 400 characters)"
              value={storeFormData.addStoreAddress}
              onChange={(e) =>
                setStoreFormData({ ...storeFormData, addStoreAddress: e.target.value })
              }
              error={errors.address}
              required
              rows={3}
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              size="large"
              className="w-full"
              variant="success"
            >
              Add Store
            </Button>
          </div>
        </form>
      </div>
    );
  };


  const filterOptions = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "address", label: "Address" },
    ...(activeTab === "users" ? [{ value: "role", label: "Role" }] : []),
  ];

  const getFilteredData = () => {
    const data = activeTab === "users" ? users : stores;
    return data.filter((item) => {
      // If there's a specific filter field selected, only search in that field
      if (filterBy && searchTerm) {
        return String(item[filterBy]).toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      // If there's only a search term without specific filter, search in all fields
      if (searchTerm && !filterBy) {
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // If no search term, show all items
      return true;
    });
  };

  const handleViewDetails = (item) => {
    if (activeTab === "users") {
      setSelectedUser(item);
    } else {
      setSelectedStore(item);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedStore(null);
  };

  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    const userRatings = ratings.filter(rating => 
      rating.userName === selectedUser.name
    );

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8 border-b border-slate-200/60">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  User Details
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Full Name</label>
                  <p className="text-xl font-bold text-slate-800 break-words">{selectedUser.name}</p>
                </div>
                
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Email Address</label>
                  <p className="text-lg text-slate-600 font-mono break-all">{selectedUser.email}</p>
                </div>
                
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">User Role</label>
                  <span
                    className={`inline-flex px-6 py-3 rounded-full text-sm font-bold shadow-sm ${
                      selectedUser.role === "System Administrator"
                        ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300"
                        : selectedUser.role === "Store Owner"
                        ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300"
                        : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Address</label>
                  <p className="text-lg text-slate-600 leading-relaxed break-words">{selectedUser.address}</p>
                </div>
                
                {selectedUser.role === "Store Owner" && selectedUser.rating && (
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                    <label className="block text-sm font-semibold text-emerald-800 mb-4 uppercase tracking-wide">Store Owner Rating</label>
                    <div className="flex items-center justify-center space-x-3">
                      <StarRating rating={selectedUser.rating} readonly size={24} />
                      <span className="text-2xl font-bold text-emerald-800">
                        {selectedUser.rating}/5
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Account ID</label>
                  <p className="text-lg text-slate-600 font-mono">#{selectedUser.id}</p>
                </div>
              </div>
            </div>
            
            {userRatings.length > 0 && (
              <div className="border-t border-slate-200/60 pt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Recent Ratings Given</h4>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {userRatings.length} ratings
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
                  {userRatings.map((rating) => {
                    const store = stores.find(s => s.id === rating.storeId);
                    return (
                      <div key={rating.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-base truncate">{store?.name || 'Unknown Store'}</p>
                            <p className="text-sm text-slate-500 mt-1">{rating.date}</p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <StarRating rating={rating.rating} readonly size={18} showValue />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {userRatings.length === 0 && (
              <div className="border-t border-slate-200/60 pt-8">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No ratings given yet</p>
                  <p className="text-slate-400 text-sm mt-2">This user hasn't rated any stores</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StoreDetailsModal = () => {
    if (!selectedStore) return null;

    const storeRatings = ratings.filter(rating => rating.storeId === selectedStore.id);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8 border-b border-slate-200/60">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Store Details
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Store Name</label>
                  <p className="text-xl font-bold text-slate-800 break-words">{selectedStore.name}</p>
                </div>
                
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Email Address</label>
                  <p className="text-lg text-slate-600 font-mono break-all">{selectedStore.email}</p>
                </div>
                
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Store ID</label>
                  <p className="text-lg text-slate-600 font-mono">#{selectedStore.id}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Address</label>
                  <p className="text-lg text-slate-600 leading-relaxed break-words">{selectedStore.address}</p>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <label className="block text-sm font-semibold text-orange-800 mb-4 uppercase tracking-wide">Overall Rating</label>
                  <div className="flex items-center justify-center space-x-4">
                    <StarRating rating={selectedStore.rating} readonly size={28} />
                    <div className="text-center">
                      <span className="text-3xl font-bold text-orange-800 block">
                        {selectedStore.rating}
                      </span>
                      <span className="text-sm text-orange-600 font-medium">out of 5</span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <span className="bg-orange-200 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
                      {storeRatings.length} {storeRatings.length === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {storeRatings.length > 0 && (
              <div className="border-t border-slate-200/60 pt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Customer Reviews</h4>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {storeRatings.length} reviews
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
                  {storeRatings.map((rating) => (
                    <div key={rating.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-base truncate">{rating.userName}</p>
                          <p className="text-sm text-slate-500 mt-1">{rating.date}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <StarRating rating={rating.rating} readonly size={18} showValue />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {storeRatings.length === 0 && (
              <div className="border-t border-slate-200/60 pt-8">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No reviews yet</p>
                  <p className="text-slate-400 text-sm mt-2">This store hasn't received any ratings</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header title="Admin Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-lg border border-white/20 overflow-x-auto scrollbar-hide">
            {["dashboard", "users", "stores", "addUser", "addStore", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-5 font-semibold text-sm whitespace-nowrap rounded-xl transition-all duration-300 min-w-fit cursor-pointer ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                {tab === "addUser"
                  ? "Add User"
                  : tab === "addStore"
                  ? "Add Store"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "dashboard" && <DashboardStats />}
        {activeTab === "addUser" && <AddUserForm />}
        {activeTab === "addStore" && <AddStoreForm />}
        {activeTab === "profile" && (
          <ProfileTab 
            passwordForm={passwordForm} 
            setPasswordForm={setPasswordForm} 
          />
        )}

        {(activeTab === "users" || activeTab === "stores") && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-slate-200/60">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {activeTab === "users"
                    ? "Users Management"
                    : "Stores Management"}
                </h3>
                <SearchFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filterBy={filterBy}
                  onFilterChange={setFilterBy}
                  filterOptions={filterOptions}
                  placeholder={`Search ${activeTab}...`}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Address
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      {activeTab === "users" ? "Role" : "Rating"}
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData().map((item, index) => (
                    <tr
                      key={item.id}
                      className={`transition-colors duration-200 ${
                        index % 2 === 0
                          ? "bg-white hover:bg-blue-50"
                          : "bg-slate-50 hover:bg-blue-50"
                      }`}
                    >
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-mono text-sm">
                        {item.email}
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">
                        {item.address}
                      </td>
                      <td className="py-4 px-6">
                        {activeTab === "users" ? (
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              item.role === "System Administrator"
                                ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800"
                                : item.role === "Store Owner"
                                ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800"
                                : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                            }`}
                          >
                            {item.role}
                          </span>
                        ) : (
                          <StarRating
                            rating={item.rating}
                            readonly
                            size={18}
                            showValue
                          />
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 hover:text-blue-700"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {getFilteredData().length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeTab === "users" ? (
                      <Users className="w-8 h-8 text-slate-500" />
                    ) : (
                      <Store className="w-8 h-8 text-slate-500" />
                    )}
                  </div>
                  <p className="text-slate-500 text-lg font-medium">
                    No {activeTab} found matching your criteria
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Try adjusting your search or filter settings
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Modals */}
        {isModalOpen && selectedUser && <UserDetailsModal />}
        {isModalOpen && selectedStore && <StoreDetailsModal />}
      </div>
    </div>
  );
};

export default AdminDashboard;
