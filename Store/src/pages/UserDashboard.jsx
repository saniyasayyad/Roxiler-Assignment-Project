import React, { useState, useEffect } from "react";
import { Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import SearchFilter from "../components/SearchFilter";
import ProfileTab from "../components/ProfileTab";
import { getStores, submitRating } from "../services/dataService";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("stores");
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    const storeData = await getStores();
    setStores(storeData);
  };

  const filterOptions = [
    { value: "name", label: "Store Name" },
    { value: "address", label: "Address" },
  ];

  const filteredStores = stores.filter((store) => {
    // If there's a specific filter field selected, only search in that field
    if (filterBy && searchTerm) {
      return String(store[filterBy]).toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // If there's only a search term without specific filter, search in name and address
    if (searchTerm && !filterBy) {
      return (
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // If no search term, show all stores
    return true;
  });

  const StoreCard = ({ store }) => {
    const [userRating, setUserRating] = useState(store.userRating || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingSubmit = async () => {
      if (userRating === 0) return;

      setIsSubmitting(true);
      try {
        await submitRating(
          store.id,
          userRating,
          currentUser.name || currentUser.email
        );

        // Update local state
        const updatedStores = stores.map((s) =>
          s.id === store.id ? { ...s, userRating: userRating } : s
        );
        setStores(updatedStores);

        setIsSubmitting(false);
        alert(`Rating ${userRating}/5 submitted for ${store.name}`);
      } catch (error) {
        console.log(error);
        alert("Failed to submit rating. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group h-full flex flex-col min-h-[320px]">
        {/* Store Info Section */}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300 mb-3 line-clamp-2">
                {store.name}
              </h3>
              <p className="text-slate-600 text-sm font-medium mb-2 line-clamp-2">
                {store.address}
              </p>
              <p className="text-slate-500 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                {store.email}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <StarRating
                rating={store.rating}
                readonly
                size={18}
                showValue
                className="justify-end mb-2"
              />
              <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-lg">
                Overall
              </p>
            </div>
          </div>
        </div>

        {/* Rating Section - Always at bottom */}
        <div className="border-t border-slate-200/60 p-6 bg-slate-50/50">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-700">Your Rating:</p>
            <div className="flex items-center justify-between">
              <StarRating
                rating={userRating}
                onRate={setUserRating}
                readonly={false}
                showValue={userRating > 0}
                size={24}
                className="flex-1"
              />

              {userRating > 0 && (
                <div className="ml-4">
                  <Button
                    onClick={handleRatingSubmit}
                    loading={isSubmitting}
                    size="small"
                    variant={store.userRating ? "accent" : "primary"}
                  >
                    {store.userRating ? "Update" : "Submit"}
                  </Button>
                </div>
              )}
            </div>
            {userRating === 0 && (
              <p className="text-xs text-slate-400 italic">
                Click stars above to rate this store
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header title="User Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-lg border border-white/20 max-w-md mx-auto">
          {["stores", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 font-semibold capitalize rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "stores" && (
          <>
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
              filterOptions={filterOptions}
              placeholder="Search stores by name or address..."
              className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-500 text-lg font-medium">
                  No stores found matching your search
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </>
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

export default UserDashboard;
