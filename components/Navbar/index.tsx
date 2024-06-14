import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar(): JSX.Element {
  const { logout } = useAuth();

  return (
    <div className="bg-white flex justify-between items-center border-black border-b border-opacity-10 fixed w-full h-[58px] py-0 px-[10%]">
      <div>
        <div className="text-black font-bold cursor-pointer text-xl">
          The <span className=" text-purple-600 ">24</span> Game
        </div>
      </div>

      <div className=" lg:flex gap-10">
        <div
          onClick={logout}
          className={`text-black font-medium cursor-pointer`}
        >
          Logout
        </div>
      </div>
    </div>
  );
}
