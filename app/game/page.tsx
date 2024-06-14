"use client";
import React, { useState, useCallback } from "react";
import Navbar from "@/components/Navbar/index";
import axios from "axios";
import History from "@/components/History/index";
import { API_BASE_URL } from "@/config";
import { useAuth } from "@/contexts/AuthContext";

const styles = {
  quitButton:
    "border-[1px] shadow-lg rounded-lg bg-green-400 w-[10rem] h-[2.5rem] text-white font-bold",
  inputBox: "border rounded p-2",
  submitButton:
    "border-[1px] shadow-lg rounded-lg bg-green-400 w-[5rem] text-white font-bold",
  solutionButton:
    "border-[1px] shadow-lg rounded-lg bg-green-400 w-[10rem] h-[2.5rem] text-white font-bold",
  clearButton: "text-red-600 font-bold cursor-pointer",
  startButton:
    "mt-14 border-[1px] shadow-lg rounded-lg bg-green-400 w-[10rem] h-[5rem] text-white font-bold text-xl",
};

const Game = () => {
  const { authState } = useAuth();
  const { user } = authState;

  const [numbers, setNumbers] = useState<number[]>([]);
  const [solution, setSolution] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [validExpressions, setValidExpressions] = useState<string[]>([]);
  const [viewHistory, setViewHistory] = useState<boolean>(false);

  const handleStart = useCallback(async () => {
    resetState();
    try {
      const response = await axios.get(`${API_BASE_URL}/generate-numbers`);
      setNumbers(response.data.numbers);
    } catch (error) {
      console.error("Error generating numbers:", error);
    }
  }, []);

  const handleSubmitSolution = useCallback(async () => {
    try {
      const userId = user?.id;
      const response = await axios.post(`${API_BASE_URL}/submit-solution`, {
        userId,
        numbers,
        solution,
      });
      setFeedback(
        response.data.isCorrect ? "Correct!" : "Incorrect, try again."
      );
    } catch (error) {
      console.error("Error submitting solution:", error);
      setFeedback("An error occurred while submitting your solution.");
    }
  }, [user, numbers, solution]);

  const handleGetSolutions = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/cheat`, { numbers });
      setValidExpressions(response.data.validExpressions);
    } catch (error) {
      console.error("Error cheat:", error);
    }
  }, [numbers]);

  const resetState = () => {
    setSolution("");
    setFeedback("");
    setValidExpressions([]);
  };

  const renderGameContent = () => {
    if (numbers.length > 0) {
      return (
        <div className="flex flex-col items-center gap-3">
          <button onClick={() => setNumbers([])} className={styles.quitButton}>
            Quit
          </button>
          <p className="mt-10 text-white ">
            Use all 4 numbers and + - * / to make 24
          </p>
          <p className="text-white text-3xl">{numbers.join(", ")}</p>
          <div className="mb-10">
            <div className="mt-5 flex gap-3">
              <input
                type="text"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Enter your solution"
                className={styles.inputBox}
              />
              <button
                onClick={handleSubmitSolution}
                className={styles.submitButton}
              >
                Submit
              </button>
            </div>
            {feedback && (
              <div
                className={`text-center mt-5 ${
                  feedback === "Correct!" ? `text-white` : `text-red-500`
                } font-bold text-xl`}
              >
                {feedback}
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center gap-6">
            <button
              onClick={handleGetSolutions}
              className={styles.solutionButton}
            >
              Get Solutions
            </button>
            <p
              className={styles.clearButton}
              onClick={() => setValidExpressions([])}
            >
              Clear
            </p>
          </div>

          {validExpressions.length > 0 ? (
            <div className="flex flex-col items-center">
              <h2> {`${validExpressions.length} solutions found`}</h2>

              <table className="bg-white">
                <thead>
                  <tr className="border-2">
                    <th className="border-2"></th>

                    <th className="border-2">solution</th>
                  </tr>
                </thead>
                <tbody>
                  {validExpressions.map((item, index) => (
                    <tr className="border-2" key={index}>
                      <td className="border-2 p-2">{index + 1}</td>
                      <td className="border-2">{item}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center gap-3">
          <p className="text-4xl font-bold">Hello "{user?.username}"</p>
          <p className="cursor-pointer" onClick={() => setViewHistory(true)}>
            {"-> View history"}
          </p>
          <button onClick={handleStart} className={styles.startButton}>
            Start Game
          </button>
        </div>
      );
    }
  };

  const renderHistory = () => {
    return (
      <div>
        <p
          className="font-bold cursor-pointer"
          onClick={() => setViewHistory(false)}
        >
          {"<- Main Page"}
        </p>
        <History userId={user?.id} />
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-[10rem] flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 gap-11">
        {viewHistory ? renderHistory() : renderGameContent()}
      </div>
    </div>
  );
};

export default Game;
