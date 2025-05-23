// Clear all cache and storage
export const clearAllCache = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear any cached data in memory
  if (window.caches) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
};

// Clear specific items from cache
export const clearSpecificCache = (keys) => {
  keys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

// Clear cart related cache
export const clearCartCache = () => {
  localStorage.removeItem('cart');
  sessionStorage.removeItem('cart');
};

// Clear user related cache
export const clearUserCache = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}; 