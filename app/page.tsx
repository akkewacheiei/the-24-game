"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 gap-11">
      <h1 className="mb-5 text-6xl text-white font-bold text-center">
        The <span className=" text-purple-800">24</span> Game
      </h1>
      <div className=" bg-white/25 lg:w-[25%] w-[90%] p-[50px] rounded-lg shadow-2xl">
        <h1 className="mb-5 text-2xl text-white font-bold text-center">
          Sign In
        </h1>
        <div>
          <div className="flex flex-col gap-4">
            <input
              className="border-b-2 border-white bg-transparent focus:outline-none focus:border-white placeholder-white text-white"
              placeholder="Username"
              type="text"
            />
            <input
              className="border-b-2 border-white bg-transparent focus:outline-none focus:border-white placeholder-white text-white"
              placeholder="Password"
              type="password"
            />
            <button className="mt-4 bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-400  transition duration-300">
              Sign In
            </button>
            <p className="text-center">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="text-purple-500 hover:underline font-bold">Sign Up</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
