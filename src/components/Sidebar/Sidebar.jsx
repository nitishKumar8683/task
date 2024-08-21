"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import {
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlineContacts,
} from "react-icons/ai";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("Sidebar button clicked"); 
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isOpen ? "w-64" : "w-16"
      } bg-gray-800 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4">
        <h1 className={`text-xl font-semibold ${isOpen ? "block" : "hidden"}`}>
          Task Management
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl p-2 hover:bg-gray-700 rounded-md"
          style={{ zIndex: 10 }} 
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <nav className="flex flex-col mt-4">
        <Link
          href="/"
          className="flex items-center p-4 hover:bg-gray-700 transition-colors duration-200"
        >
          <AiOutlineHome className="text-xl mr-4" />
          <span className={`text-lg ${isOpen ? "block" : "hidden"}`}>Home</span>
        </Link>
        <Link
          href="/about"
          className="flex items-center p-4 hover:bg-gray-700 transition-colors duration-200"
        >
          <AiOutlineInfoCircle className="text-xl mr-4" />
          <span className={`text-lg ${isOpen ? "block" : "hidden"}`}>
            About
          </span>
        </Link>
        <Link
          href="/contact"
          className="flex items-center p-4 hover:bg-gray-700 transition-colors duration-200"
        >
          <AiOutlineContacts className="text-xl mr-4" />
          <span className={`text-lg ${isOpen ? "block" : "hidden"}`}>
            Contact
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
