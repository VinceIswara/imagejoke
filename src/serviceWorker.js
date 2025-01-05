// src/serviceWorker.js
    export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          registration.update();  
          console.log('Service Worker registered');
        })
        .catch((error) => {
          console.error('Error registering Service Worker:', error);
        });
    }
  }