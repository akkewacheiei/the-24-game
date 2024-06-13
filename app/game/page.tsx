"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/index";
import { useRouter } from "next/navigation";
import axios from "axios";
import History from "../../components/History/index";

interface user {
  id: number;
  username: string;
}

export default function Game() {
  const router = useRouter();
  const [numbers, setNumbers] = useState<number[]>([]);
  const [solution, setSolution] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [user, setUser] = useState<user>();
  const [validExpressions, setValidExpressions] = useState<string[]>([]);
  const [viewHistory, setViewHistory] = useState<boolean>(false);

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
    setSolution("");
    setFeedback("");
    setValidExpressions([]);

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

  const handleGetSolutions = async () => {
    console.log("numbers:", numbers);

    try {
      const response = await axios.post("http://localhost:8000/cheat", {
        numbers,
      });
      console.log("handleGetSolutions res:", response);
      setValidExpressions(response.data.validExpressions);
    } catch (error) {
      console.error("Error cheat:", error);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-screen p-[10rem] flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 gap-11">
        {!viewHistory ? (
          <>
            {numbers.length > 0 ? (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => {
                    setNumbers([]);
                  }}
                  className="border-[1px] shadow-lg rounded-lg bg-green-400 w-[10rem] h-[2.5rem] text-white font-bold"
                >
                  {"Quit"}
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
                    className="ml-3 border-[1px] shadow-lg rounded-lg bg-green-400 w-[5rem] h-[2.5rem] text-white font-bold"
                  >
                    Submit
                  </button>
                </div>
                {feedback && (
                  <div
                    className={`mt-5 ${
                      feedback === "Correct!" ? `text-white` : `text-red-500`
                    } font-bold  text-xl`}
                  >
                    {feedback}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-6 ">
                  <button
                    onClick={handleGetSolutions}
                    className="border-[1px] shadow-lg rounded-lg bg-green-400 w-[10rem] h-[2.5rem] text-white font-bold"
                  >
                    {"Get Solutions"}
                  </button>
                  <p
                    className=" text-red-600 font-bold cursor-pointer"
                    onClick={() => setValidExpressions([])}
                  >
                    Clear
                  </p>
                </div>

                <h2>
                  {validExpressions.length > 0 &&
                    `${validExpressions.length} solutions found`}
                </h2>

                <div className="flex gap-10 flex-wrap w-[20rem]">
                  {validExpressions.length > 0 &&
                    validExpressions.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <p className="text-4xl font-bold">Hello "{user?.username}"</p>
                <p
                  className="cursor-pointer"
                  onClick={() => setViewHistory(true)}
                >
                  {"-> View history"}
                </p>
                <button
                  onClick={handleStart}
                  className="mt-14 border-[1px] shadow-lg rounded-lg bg-green-400 w-[10rem] h-[5rem] text-white font-bold text-xl"
                >
                  {"Start Game"}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {" "}
            <p
              className="font-bold cursor-pointer"
              onClick={() => setViewHistory(false)}
            >
              {"<- Main Page"}
            </p>
            <History userId={user?.id}></History>
          </>
        )}
      </div>
    </div>
  );
}
