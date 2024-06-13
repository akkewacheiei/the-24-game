"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register", {
        username,
        password,
      });

      if (response.status === 200) {
        setMessage("Account created successfully");
        router.push("/");
      } else {
        setMessage(response.data.message || "Something went wrong");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400">
      <h1 className="mb-5 text-4xl text-white font-bold text-center">
        Create Account
      </h1>
      <div className="bg-white/25 lg:w-[25%] p-[50px] rounded-lg shadow-2xl">
        <h1 className="mb-5 text-2xl text-white font-bold text-center">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <input
              className="border-b-2 border-white bg-transparent focus:outline-none focus:border-white placeholder-white text-white"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
            <input
              className="border-b-2 border-white bg-transparent focus:outline-none focus:border-white placeholder-white text-white"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <input
              className="border-b-2 border-white bg-transparent focus:outline-none focus:border-white placeholder-white text-white"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            />
            <button className="mt-4 bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-400 transition duration-300">
              Sign Up
            </button>
            {message && (
              <p className="text-center text-white mt-4">{message}</p>
            )}
            <p className="text-center">
              Do you have an account?{" "}
              <Link href="/">
                <span className="text-purple-500 hover:underline font-bold">
                  Sign In
                </span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
