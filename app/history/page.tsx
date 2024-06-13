"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar/index";
import axios from "axios";


type HistoryItem = {
  id: number;
  userId: number;
  numbers: number[];
  solution: string;

  // Define other properties based on your History model
};

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:8000/history", {
          params: {
            userId: 1, // Replace with actual userId
          },
        });

        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        // Handle error, e.g., show a message to the user
      }
    };

    fetchHistory();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 gap-11">
        <Link href="/game">{"<- หน้าหลัก"}</Link>
        <div className="mt-4">
          <h2>Recent History</h2>
          <ul>
            {history.map((item) => (
              <li key={item.id}>{item.id} {item.userId} {item.numbers} {item.solution}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
