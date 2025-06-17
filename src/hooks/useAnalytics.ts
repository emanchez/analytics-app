"use client";
import { use, useEffect } from "react";

/**
 * Custom hook for tracking user analytics events
 *
 * Features:
 * - Manual event tracking via trackEvent function
 * - Automatic tracking of elements with 'trackable' class
 * - Sends data to Flask backend API
 * - Handles click events by default
 *
 * @returns {Object} Object containing trackEvent function
 */
const useAnalytics = () => {
  /**
   * Manually track an analytics event
   *
   * @param {string} eventType - Type of event (e.g., 'click', 'change', 'focus')
   * @param {HTMLElement} element - DOM element that triggered the event
   * @param {any} additionalData - Optional additional data to include with event
   *
   * @example
   * trackEvent('click', buttonElement, {
   *   action: 'add_to_cart',
   *   productId: '123'
   * });
   */
  const trackEvent = async (
    eventType: string,
    element: HTMLElement,
    additionalData?: any
  ) => {
    try {
      // Build event payload with standard fields
      const eventData = {
        eventType,
        elementId: element.id,
        elementTag: element.tagName.toLowerCase(),
        timestamp: new Date().toISOString(),
        ...additionalData, // Spread additional data last to allow overrides
      };

      // Send event data to Flask backend
      await fetch("http://localhost:5000/api/post-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  };

  /**
   * Set up automatic event listeners for elements with 'trackable' class
   *
   * This effect runs once on component mount and sets up global event listeners
   * that automatically track interactions with any element having the 'trackable' class
   */
  useEffect(() => {
    /**
     * Handle DOM events and track them if element is trackable
     *
     * @param {Event} event - DOM event object
     */
    const handleEvent = (event: Event) => {
      const target = event.target as HTMLElement;

      // Only track events on elements with 'trackable' class
      if (target.classList.contains("trackable")) {
        // Handle different element types with specific data extraction
        switch (target.tagName.toLowerCase()) {
          case "input":
            console.log("Analytics: Detected input interaction");
            // For input elements, capture the current value
            trackEvent(event.type, target, {
              tagData: {
                value: (target as HTMLInputElement).value,
              },
            });
            break;

          default:
            console.log("Analytics: Detected general element interaction");
            // For other elements, track basic event info
            trackEvent(event.type, target);
        }
      }
    };

    // Define which event types to automatically track
    const eventTypes = ["click"]; // Currently only tracking click events for simplicity

    // Add event listeners for each event type
    // Using capture phase (true) to ensure we catch events before they bubble
    eventTypes.forEach((type) => {
      document.addEventListener(type, handleEvent, true);
    });

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      eventTypes.forEach((type) => {
        document.removeEventListener(type, handleEvent, true);
      });
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Return the trackEvent function for manual tracking
  return { trackEvent };
};

export default useAnalytics;
