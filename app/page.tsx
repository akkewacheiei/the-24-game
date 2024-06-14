"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    //ถ้ามี token เก็บอยู่แล้ว ให้นำไปเช็คเซสชัน
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      login(response.data.user); // ใช้ฟังก์ชัน login ใน AuthContext
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  }, [login]);

  const handleSignIn = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      fetchUserData();
    } catch (error) {
      console.error("Error logging in", error);
      setError("Invalid username or password. Please try again.");
    }
  }, [username, password, fetchUserData]);

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
