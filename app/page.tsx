"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // ถ้ามี token อยู่ใน local storage ใช้ token นี้ส่งคำขอไปยังเซิร์ฟเวอร์เพื่อตรวจสอบสถานะเซสชัน
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      // ส่ง token ไปกับคำขอ
      const response = await axios.get("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("user data:", response.data.user);
      router.push("/game");
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        username: username,
        password: password,
      });
      //console.log(response.data);
      const token = response.data.token;
      // บันทึก token ไว้ใน local storage
      localStorage.setItem("token", token);
      // เรียกใช้ fetchUserData เมื่อ login สำเร็จ
      fetchUserData();
    } catch (error) {
      console.error("Error logging in", error);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 gap-11">
      <h1 className="mb-5 text-6xl text-white font-bold text-center">
        The <span className="text-purple-800">24</span> Game
      </h1>
      <div className="bg-white/25 lg:w-[25%] w-[90%] p-[50px] rounded-lg shadow-2xl">
        <h1 className="mb-5 text-2xl text-white font-bold text-center">
          Sign In
        </h1>
        <div>
          <div className="flex flex-col gap-4">
            <input
              className="border-b-2 border-white bg-transparent focus:outline-none focus:border-white placeholder-white text-white"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="border-b-2 border-white bg-transparent focus:outline-none focus:border-white placeholder-white text-white"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="mt-4 bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-400 transition duration-300"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-center">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="text-purple-500 hover:underline font-bold">
                  Sign Up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
