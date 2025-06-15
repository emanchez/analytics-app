"use client";
import { use, useEffect } from "react";

const useAnalytics = () => {
  const trackEvent = async (
    eventType: string,
    element: HTMLElement,
    additionalData?: any
  ) => {
    try {
      const eventData = {
        eventType,
        elementId: element.id,
        elementTag: element.tagName.toLowerCase(),
        timestamp: new Date().toISOString(),
        ...additionalData,
      };

      await fetch("http://localhost:5000/api/post-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  };

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const target = event.target as HTMLElement;
      
      if (target.classList.contains("trackable")) {
        // Same event handling logic as above
        switch(target.tagName.toLowerCase()){
          case("input"):
            console.log('detected input'); 
            trackEvent(event.type, target, { "tagData" : {"value": (target as HTMLInputElement).value}});
            break;
          default:
            console.log('detected other');
            trackEvent(event.type, target);
        }
      }
    };
    // only track click events for simplicity
    const eventTypes = ["click"];
    eventTypes.forEach((type) => {
      document.addEventListener(type, handleEvent, true);
    });

    return () => {
      eventTypes.forEach((type) => {
        document.removeEventListener(type, handleEvent, true);
      });
    };
  }, []);

  return { trackEvent };
};

export default useAnalytics;
