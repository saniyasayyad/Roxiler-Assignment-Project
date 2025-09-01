import React, { useState, useEffect } from "react";
import { Store } from "lucide-react";
import Header from "../components/Header";
import StarRating from "../components/StarRating";
import ProfileTab from "../components/ProfileTab";
import { useAuth } from "../context/AuthContext";
import { getRatings, getStores } from "../services/dataService";

const StoreDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [allRatings, setAllRatings] = useState([]);
  const [stores, setStores] = useState([]);
  const [userStore, setUserStore] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [ratingData, storeData] = await Promise.all([
      getRatings(),
      getStores()
    ]);
    setAllRatings(ratingData);
    setStores(storeData);
    
    // Find the store owned by the current user (match by email)
    const ownedStore = storeData.find(store => store.email === currentUser?.email);
    setUserStore(ownedStore);
  };

  // Filter ratings for this store owner's specific store
  const storeRatings = userStore 
    ? allRatings.filter(rating => rating.storeId === userStore.id)
    : [];

  // Calculate store statistics
  const avgRating =
    storeRatings.length > 0
      ? storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length
      : 0;

  const thisMonthRatings = storeRatings.filter((r) => {
    const ratingDate = new Date(r.date);
    const now = new Date();
    return (
      ratingDate.getMonth() === now.getMonth() &&
      ratingDate.getFullYear() === now.getFullYear()
    );
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header title="Store Owner Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            {(userStore ? ["dashboard", "ratings", "profile"] : ["dashboard", "profile"]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 font-semibold capitalize rounded-xl transition-all duration-300 text-sm min-w-[100px] cursor-pointer ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {!userStore && activeTab === "dashboard" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Store Not Found
            </h3>
            <p className="text-slate-600 mb-4">
              No store is registered with your email address. Please contact an administrator to register your store.
            </p>
            <p className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg inline-block">
              Email: {currentUser?.email}
            </p>
          </div>
        )}
        
        {userStore && activeTab === "dashboard" && (
          <div className="mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{userStore.name}</h2>
                <p className="text-slate-600 mb-2">{userStore.address}</p>
                <p className="text-sm text-slate-500 font-mono">{userStore.email}</p>
              </div>
            </div>
          </div>
        )}
        
        {userStore && activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 card-hover group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Store Performance
                </h3>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-4">
                  {avgRating.toFixed(1)}
                </div>
                <StarRating
                  rating={Math.round(avgRating)}
                  readonly
                  className="justify-center mb-4"
                  size={24}
                />
                <p className="text-slate-600 font-semibold mb-2">
                  Average Rating
                </p>
                <p className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block">
                  Based on {storeRatings.length} reviews
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 card-hover">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">
                    Total Reviews
                  </span>
                  <span className="font-bold text-xl text-slate-800">
                    {storeRatings.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">
                    This Month
                  </span>
                  <span className="font-bold text-xl text-emerald-600">
                    +{thisMonthRatings.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">
                    Average This Month
                  </span>
                  <span className="font-bold text-xl text-blue-600">
                    {thisMonthRatings.length > 0
                      ? (
                          thisMonthRatings.reduce(
                            (sum, r) => sum + r.rating,
                            0
                          ) / thisMonthRatings.length
                        ).toFixed(1)
                      : "0.0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ratings" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-slate-200/60">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Customer Ratings
              </h3>
              <p className="text-slate-600 mt-2">
                All customer feedback and ratings
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Customer Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Rating
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {storeRatings.map((rating, index) => (
                    <tr
                      key={rating.id}
                      className={`transition-colors duration-200 ${
                        index % 2 === 0
                          ? "bg-white hover:bg-amber-50"
                          : "bg-slate-50 hover:bg-amber-50"
                      }`}
                    >
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {rating.userName}
                      </td>
                      <td className="py-4 px-6">
                        <StarRating
                          rating={rating.rating}
                          readonly
                          size={18}
                          showValue
                        />
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-mono text-sm">
                        {new Date(rating.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>

              {storeRatings.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-slate-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-lg font-medium">
                    No ratings yet
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Customer ratings will appear here once submitted
                  </p>
                </div>
              )}
              </table>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <ProfileTab 
            passwordForm={passwordForm} 
            setPasswordForm={setPasswordForm} 
          />
        )}
      </div>
    </div>
  );
};

export default StoreDashboard;
