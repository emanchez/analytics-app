'use client'
import { read } from "fs";
import { get } from "http";
import Image from "next/image";
import { useEffect,useState } from "react";

export default function Home() {
  const [responseData, setResponseData] = useState(null);
  useEffect(() => {
    const getHello = async () => {
      const res = await fetch("http://localhost:5000/api/hello")
      const data = await res.json();
      setResponseData(data);
    }
    
    getHello();
  }, []);
  console.log(responseData)
  return (
    <div>
      {
        responseData
      }
    </div>
  );
}
