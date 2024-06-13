"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/index";
import { useRouter } from "next/navigation";
import axios from "axios";
import fetchUserData from "../../utils/fetchUserData";

export default function Home() {
  const router = useRouter();
  const [numbers, setNumbers] = useState<number[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // ถ้ามี token อยู่ใน local storage ใช้ token นี้ส่งคำขอไปยังเซิร์ฟเวอร์เพื่อตรวจสอบสถานะเซสชัน
      checkAuth();
    } else {
      //ถ้าไม่มี token เตะออกไปหน้า landing page
      router.push("/");
    }
  }, []);

  const checkAuth = async () => {
    const isAuth = await fetchUserData();

    if (!isAuth) {
      router.push("/"); //ถ้า session หมดอายุเตะออกไปหน้า landing page
    }
  };

  const handleStart = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/generate-numbers"
      );
      setNumbers(response.data.numbers);
    } catch (error) {
      console.error("Error generating numbers:", error);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 gap-11">
        {numbers.length > 0 ? (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setNumbers([])}
              className="border-[1px] shadow-lg rounded-lg bg-orange-400 text-white font-bold"
            >
              {"เปลี่ยนโจทย์"}
            </button>
            <div className="mt-5 text-white text-xl">
              Generated Numbers: {numbers.join(", ")}
            </div>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="border-[1px] shadow-lg rounded-lg bg-orange-400 w-[10rem] h-[5rem] text-white font-bold text-xl"
          >
            {"START"}
          </button>
        )}
      </div>
    </div>
  );
}
