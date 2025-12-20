"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('Service Worker registered:', reg);

      if (!reg) return;

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New content available; consider refreshing.');
          }
        });
      });
    }).catch((err) => {
      console.error('Service Worker registration failed:', err);
    });

    // optional: react to controller change
    const onControllerChange = () => {
      console.log('Service worker controller changed');
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return null;
}
