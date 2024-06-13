import styles from "./Styles.module.css";
import React from "react";
import { useRouter } from "next/navigation";


export default function Navbar(): JSX.Element {
  const router = useRouter();

  const handleLogout = () => {
    // ลบ token ที่เก็บไว้ใน local storage
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      <div
        id={styles.nav}
        className="bg-white flex justify-between items-center border-black border-b border-opacity-10 fixed w-full"
      >
        <div id="logo">
          <div className="text-black font-bold cursor-pointer text-xl">The <span className=" text-purple-600 ">24</span> Game</div>
        </div>

        <div id="menu" className=" lg:flex gap-10">
          <div
            onClick={handleLogout}
            className={`text-black font-medium cursor-pointer`}
          >
            Sign Out
          </div>
        </div>
      </div>
    </>
  );
}
