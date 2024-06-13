"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/index";
import { useRouter } from "next/navigation";
import axios from "axios";
import fetchUserData from "../../utils/fetchUserData";

export default function Home() {
  const router = useRouter();

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

  return (
    <div>
      <Navbar></Navbar>
      <h1 className="pt-[100px]">Game Page</h1>
    </div>
  );
}
