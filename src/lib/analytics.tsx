"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from './firebase'; // Ensure you have this file configured

type AnalyticsContextType = {
  trackEvent: (stepId: string) => void;
  userId: string | null;
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, ensuring client-specific code
    // does not cause a hydration mismatch.
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      let currentUserId = localStorage.getItem('funnel_userId');
      if (!currentUserId) {
        currentUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('funnel_userId', currentUserId);
      }
      setUserId(currentUserId);
    }
  }, [isClient]);

  const trackEvent = async (stepId: string) => {
    if (!userId) return;

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'funnel_analytics'), {
        userId,
        stepId,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error tracking event in Firestore:', error);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, userId }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
