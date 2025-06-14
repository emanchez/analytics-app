"use client";
import Image from "next/image";
import useAnalytics from "@/hooks/useAnalytics";

export default function Home() {
  // Apply the useAnalytics hook
  const { trackEvent } = useAnalytics();

  return (
    <div>
      <h2>rtjky</h2>
      <button id="btn1" className="trackable">
        btn1
      </button>
      <input
        id="input1"
        className="trackable"
        placeholder="Type something..."
        type="text"
      />
      <select id="select1" className="trackable">
        <option id="select1-option1" value="option1" className="trackable">
          Option 1
        </option>
        <option id="select1-option2" value="option2" className="trackable">
          Option 2
        </option>
      </select>
    </div>
  );
}
