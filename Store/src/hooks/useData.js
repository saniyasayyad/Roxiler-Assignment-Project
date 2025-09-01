import { useState, useEffect } from 'react';
import { getUsers, getStores, getRatings } from '../services/dataService';

export const useData = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [userData, storeData, ratingData] = await Promise.all([
        getUsers(),
        getStores(),
        getRatings()
      ]);
      
      setUsers(userData);
      setStores(storeData);
      setRatings(ratingData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNewUser = (user) => {
    setUsers(prev => [...prev, user]);
  };

  const updateStore = (storeId, updates) => {
    setStores(prev => prev.map(store => 
      store.id === storeId ? { ...store, ...updates } : store
    ));
  };

  const addRating = (rating) => {
    setRatings(prev => [...prev, rating]);
  };

  return {
    users,
    stores,
    ratings,
    loading,
    error,
    addNewUser,
    updateStore,
    addRating,
    refetch: loadAllData
  };
};

export const useSearch = (data, searchTerm, searchFields = []) => {
  return data.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    if (searchFields.length > 0) {
      return searchFields.some(field => 
        String(item[field]).toLowerCase().includes(searchLower)
      );
    }
    
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );
  });
};
