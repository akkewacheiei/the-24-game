"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar/index";

type Props = {};

export default function page({}: Props) {
  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 gap-11">
        <Link href="/game">{"<- หน้าหลัก"}</Link>
        <div>history page</div>
      </div>
    </div>
  );
}
