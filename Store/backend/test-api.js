import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUsers = {
  admin: {
    email: 'admin@system.com',
    password: 'Admin@123'
  },
  normal: {
    email: 'jane@email.com',
    password: 'Admin@123'
  },
  storeOwner: {
    email: 'store@owner.com',
    password: 'Admin@123'
  }
};

let adminToken = '';
let normalUserToken = '';
let storeOwnerToken = '';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    return {
      status: response.status,
      data,
      success: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      success: false
    };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('🏥 Testing health check...');
  const result = await apiCall('/health');
  console.log(`Status: ${result.status}, Success: ${result.success}`);
  if (result.success) {
    console.log('✅ Health check passed');
  } else {
    console.log('❌ Health check failed');
  }
  console.log('');
}

async function testLogin() {
  console.log('🔐 Testing login functionality...');
  
  // Test admin login
  const adminResult = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(testUsers.admin)
  });
  
  if (adminResult.success) {
    adminToken = adminResult.data.data.token;
    console.log('✅ Admin login successful');
  } else {
    console.log('❌ Admin login failed:', adminResult.data.message);
  }
  
  // Test normal user login
  const normalResult = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(testUsers.normal)
  });
  
  if (normalResult.success) {
    normalUserToken = normalResult.data.data.token;
    console.log('✅ Normal user login successful');
  } else {
    console.log('❌ Normal user login failed:', normalResult.data.message);
  }
  
  // Test store owner login
  const storeOwnerResult = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(testUsers.storeOwner)
  });
  
  if (storeOwnerResult.success) {
    storeOwnerToken = storeOwnerResult.data.data.token;
    console.log('✅ Store owner login successful');
  } else {
    console.log('❌ Store owner login failed:', storeOwnerResult.data.message);
  }
  
  console.log('');
}

async function testAdminEndpoints() {
  if (!adminToken) {
    console.log('❌ Skipping admin tests - no admin token');
    return;
  }
  
  console.log('👑 Testing admin endpoints...');
  
  // Test dashboard stats
  const statsResult = await apiCall('/admin/dashboard/stats', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  
  if (statsResult.success) {
    console.log('✅ Dashboard stats retrieved');
    console.log(`   Users: ${statsResult.data.data.totalUsers}`);
    console.log(`   Stores: ${statsResult.data.data.totalStores}`);
    console.log(`   Ratings: ${statsResult.data.data.totalRatings}`);
  } else {
    console.log('❌ Dashboard stats failed:', statsResult.data.message);
  }
  
  // Test get users
  const usersResult = await apiCall('/admin/users', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  
  if (usersResult.success) {
    console.log(`✅ Users retrieved: ${usersResult.data.data.users.length} users`);
  } else {
    console.log('❌ Get users failed:', usersResult.data.message);
  }
  
  // Test get stores
  const storesResult = await apiCall('/admin/stores', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  
  if (storesResult.success) {
    console.log(`✅ Stores retrieved: ${storesResult.data.data.stores.length} stores`);
  } else {
    console.log('❌ Get stores failed:', storesResult.data.message);
  }
  
  console.log('');
}

async function testStoreEndpoints() {
  if (!normalUserToken) {
    console.log('❌ Skipping store tests - no normal user token');
    return;
  }
  
  console.log('🏪 Testing store endpoints...');
  
  // Test get stores for user
  const storesResult = await apiCall('/stores', {
    headers: { 'Authorization': `Bearer ${normalUserToken}` }
  });
  
  if (storesResult.success) {
    console.log(`✅ Stores for user retrieved: ${storesResult.data.data.stores.length} stores`);
  } else {
    console.log('❌ Get stores for user failed:', storesResult.data.message);
  }
  
  // Test submit rating
  const ratingResult = await apiCall('/stores/ratings', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${normalUserToken}` },
    body: JSON.stringify({ storeId: 1, rating: 5 })
  });
  
  if (ratingResult.success) {
    console.log('✅ Rating submitted successfully');
  } else {
    console.log('❌ Submit rating failed:', ratingResult.data.message);
  }
  
  console.log('');
}

async function testStoreOwnerEndpoints() {
  if (!storeOwnerToken) {
    console.log('❌ Skipping store owner tests - no store owner token');
    return;
  }
  
  console.log('👨‍💼 Testing store owner endpoints...');
  
  // Test store owner dashboard
  const dashboardResult = await apiCall('/store-owner/dashboard', {
    headers: { 'Authorization': `Bearer ${storeOwnerToken}` }
  });
  
  if (dashboardResult.success) {
    console.log('✅ Store owner dashboard retrieved');
    console.log(`   Stores: ${dashboardResult.data.data.statistics.totalStores}`);
    console.log(`   Ratings: ${dashboardResult.data.data.statistics.totalRatings}`);
    console.log(`   Average Rating: ${dashboardResult.data.data.statistics.averageRating}`);
  } else {
    console.log('❌ Store owner dashboard failed:', dashboardResult.data.message);
  }
  
  console.log('');
}

async function testValidation() {
  console.log('✅ Testing validation...');
  
  // Test invalid email
  const invalidEmailResult = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'invalid-email',
      password: 'Admin@123'
    })
  });
  
  if (!invalidEmailResult.success && invalidEmailResult.status === 400) {
    console.log('✅ Email validation working');
  } else {
    console.log('❌ Email validation not working');
  }
  
  // Test invalid rating
  if (normalUserToken) {
    const invalidRatingResult = await apiCall('/stores/ratings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${normalUserToken}` },
      body: JSON.stringify({ storeId: 1, rating: 6 })
    });
    
    if (!invalidRatingResult.success && invalidRatingResult.status === 400) {
      console.log('✅ Rating validation working');
    } else {
      console.log('❌ Rating validation not working');
    }
  }
  
  console.log('');
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealthCheck();
  await testLogin();
  await testAdminEndpoints();
  await testStoreEndpoints();
  await testStoreOwnerEndpoints();
  await testValidation();
  
  console.log('🎉 API tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };



