"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/index";
import { useRouter } from "next/navigation";
import axios from "axios";

interface user {
  id: number;
  username: string;
}

export default function Home() {
  const router = useRouter();
  const [numbers, setNumbers] = useState<number[]>([]);
  const [solution, setSolution] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [user, setUser] = useState<user>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // ถ้ามี token อยู่ใน local storage ใช้ token นี้ส่งคำขอไปยังเซิร์ฟเวอร์เพื่อตรวจสอบสถานะเซสชัน
      fetchUserData();
    } else {
      //ถ้าไม่มี token เตะออกไปหน้า landing page
      router.push("/");
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      // ส่ง token ไปกับคำขอ
      const response = await axios.get("http://localhost:8000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("user data:", response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user data", error);
      //ถ้าเซสชันหมดอายุ เตะออกไปหน้า landing page
      router.push("/");
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

  const handleSubmitSolution = async () => {
    try {
      const userId = user?.id;
      const response = await axios.post(
        "http://localhost:8000/submit-solution",
        {
          userId,
          numbers,
          solution,
        }
      );
      setFeedback(
        response.data.isCorrect ? "Correct!" : "Incorrect, try again."
      );
    } catch (error) {
      console.error("Error submitting solution:", error);
      setFeedback("An error occurred while submitting your solution.");
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
              className="border-[1px] shadow-lg rounded-lg bg-green-400 text-white font-bold"
            >
              {"เปลี่ยนโจทย์"}
            </button>
            <div className="mt-5 text-white text-xl">
              Generated Numbers: {numbers.join(", ")}
            </div>
            <div className="mt-5">
              <input
                type="text"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Enter your solution"
                className="border rounded p-2"
              />
              <button
                onClick={handleSubmitSolution}
                className="ml-3 border-[1px] shadow-lg rounded-lg bg-green-400 w-[10rem] h-[2.5rem] text-white font-bold text-xl"
              >
                Submit
              </button>
            </div>
            {feedback && (
              <div className="mt-5 text-white text-xl">{feedback}</div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xl mb-14">สวัสดี คุณ "{user?.username}"</p>
            <button
              onClick={handleStart}
              className="border-[1px] shadow-lg rounded-lg bg-green-400 w-[10rem] h-[5rem] text-white font-bold text-xl"
            >
              {"Start Game"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
