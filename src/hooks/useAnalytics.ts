"use client";
import { useEffect, useState, useCallback } from "react";
import { getSessionId } from "@/utils/sessionManager";

/**
 * Simple analytics hook template
 * Ready for clean implementation
 */
const useAnalytics = () => {
  const [sessionId, setSessionId] = useState<string>("");

  // Initialize session ID
  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
  }, []);

  /**
   * Track an analytics event
   */
  const trackEvent = useCallback(
    async (eventData: {
      eventType: string;
      action?: string;
      elementId?: string;
      [key: string]: any;
    }) => {
      if (!sessionId) return;

      try {
        const payload = {
          sessionId,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          ...eventData,
        };

        await fetch("http://localhost:5000/api/post-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log("Event tracked:", payload);
      } catch (error) {
        console.error("Failed to track event:", error);
      }
    },
    [sessionId]
  );

  return { trackEvent, sessionId };
};

export default useAnalytics;
