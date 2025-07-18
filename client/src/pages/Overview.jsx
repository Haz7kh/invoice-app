import React from "react";
import Header from "../components/Header";
import { FaCheck } from "react-icons/fa";

export default function Overview() {
  return (
    <>
      <Header />
      <div className="bg-white py-16 px-6  border-5 shadow-2xl border-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-blue-600">Factora.nu</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Your hub for smart solutions and bold innovation.
            </p>
            <div className="space-y-4">
              {["Fast & Reliable", "User-Centered Design", "Smart Integration"].map((item, index) => (
                <div key={index}>
                  <h3 className="flex items-center gap-3 text-xl text-gray-800 font-medium">
                    <FaCheck className="bg-green-500 text-white p-1 rounded-full" size={20} />
                    {item}
                  </h3>
                  <p className="pl-9 text-gray-500">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              className="w-64 h-64 object-cover rounded-xl shadow-md"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFmjrsTvxkBwH4kqZqovdlU_8i4nbvg8-jA&s"
              alt="Overview Visual"
            />
          </div>
        </div>
      </div>
    </>
  );
}
