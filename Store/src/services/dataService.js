// Mock data service - in a real application, this would connect to a backend API

export const mockStores = [
  { 
    id: 1, 
    name: 'Tech Electronics Store', 
    email: 'tech@store.com', 
    address: '123 Tech Street, Silicon Valley', 
    rating: 4.2, 
    userRating: null 
  },
  { 
    id: 2, 
    name: 'Fashion Boutique Premium', 
    email: 'fashion@boutique.com', 
    address: '456 Fashion Ave, New York', 
    rating: 3.8, 
    userRating: 4 
  },
  { 
    id: 3, 
    name: 'Grocery Mart Superstore', 
    email: 'grocery@mart.com', 
    address: '789 Market St, Downtown', 
    rating: 4.5, 
    userRating: null 
  },
  { 
    id: 4, 
    name: 'Premium Store Owner Shop', 
    email: 'store@owner.com', 
    address: '400 Owner Plaza, Business District', 
    rating: 4.3, 
    userRating: null 
  }
];

export const mockUsers = [
  { 
    id: 1, 
    name: 'John Administrator Smith', 
    email: 'admin@system.com', 
    address: '100 Admin St, City', 
    role: 'System Administrator' 
  },
  { 
    id: 2, 
    name: 'Jane Normal User Johnson', 
    email: 'jane@email.com', 
    address: '200 User Ave, Town', 
    role: 'Normal User' 
  },
  { 
    id: 3, 
    name: 'Premium Store Owner', 
    email: 'store@owner.com', 
    address: '400 Owner Plaza, Business District', 
    role: 'Store Owner', 
    rating: 4.3 
  }
];

export const mockRatings = [
  { id: 1, userName: 'Jane Normal User Johnson', rating: 4, storeId: 1, date: '2025-08-25' },
  { id: 2, userName: 'Alice Customer Brown', rating: 5, storeId: 1, date: '2025-08-20' },
  { id: 3, userName: 'Bob Reviewer Davis', rating: 3, storeId: 1, date: '2025-08-15' },
  { id: 4, userName: 'Sarah Customer Lee', rating: 5, storeId: 4, date: '2025-08-30' },
  { id: 5, userName: 'John Customer Smith', rating: 4, storeId: 4, date: '2025-08-28' },
  { id: 6, userName: 'Emma Customer Brown', rating: 4, storeId: 4, date: '2025-08-26' },
  { id: 7, userName: 'David Owner Customer', rating: 5, storeId: 4, date: '2025-08-29' },
  { id: 8, userName: 'Lisa Owner Reviewer', rating: 3, storeId: 4, date: '2025-08-27' },
  { id: 9, userName: 'Peter Owner Customer', rating: 4, storeId: 4, date: '2025-08-24' }
];

// API-like functions
export const getStores = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStores), 100);
  });
};

export const getUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 100);
  });
};

export const getRatings = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRatings), 100);
  });
};

export const addUser = async (userData) => {
  return new Promise((resolve) => {
    const newUser = {
      id: Date.now(),
      ...userData,
    };
    mockUsers.push(newUser);
    setTimeout(() => resolve(newUser), 100);
  });
};

export const addStore = async (storeData) => {
  return new Promise((resolve) => {
    const newStore = {
      id: Date.now(),
      ...storeData,
      rating: 0, // New stores start with 0 rating
      userRating: null
    };
    mockStores.push(newStore);
    setTimeout(() => resolve(newStore), 100);
  });
};

export const submitRating = async (storeId, rating, userName) => {
  return new Promise((resolve) => {
    const newRating = {
      id: Date.now(),
      userName,
      rating,
      storeId,
      date: new Date().toISOString().split('T')[0]
    };
    mockRatings.push(newRating);
    
    // Update store rating
    const store = mockStores.find(s => s.id === storeId);
    if (store) {
      const storeRatings = mockRatings.filter(r => r.storeId === storeId);
      const avgRating = storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length;
      store.rating = Math.round(avgRating * 10) / 10;
    }
    
    setTimeout(() => resolve(newRating), 100);
  });
};
