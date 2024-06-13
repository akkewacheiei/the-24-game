"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar/index";
import axios from "axios";

type HistoryItem = {
  id: number;
  userId: number;
  numbers: number[];
  solution: string;
  createdAt: Date;
  updatedAt: Date;
};

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:8000/history", {
          params: {
            userId: 2,
          },
        });

        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);
  return (
    <div>
      <div className="mt-4">
        {history.length > 0 ? (
          <>
            <h1 className="text-center font-bold text-xl">History</h1>
            <table className="border-2">
              <thead>
                <tr className="border-2">
                  <th className="border-2"></th>
                  <th className="border-2">numbers</th>
                  <th className="border-2">solution</th>
                  <th className="border-2">createdAt</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr className="border-2" key={item.id}>
                    <td className="border-2 p-2">{index + 1}</td>
                    <td className="border-2">{item.numbers}</td>
                    <td className="border-2">{item.solution}</td>
                    <td className="border-2">
                      {item.createdAt.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No history yet.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
