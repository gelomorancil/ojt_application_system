import { useState } from "react";

export default function Tabs({ activeTab, setActiveTab }) {
    return (
        <div className="border-b">
            <nav className="flex space-x-8">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === "contacts" ? "border-b-2 border-black" : "text-gray-500"}`}
                    onClick={() => setActiveTab("contacts")}
                >
                    List of Contacts
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === "interns" ? "border-b-2 border-black" : "text-gray-500"}`}
                    onClick={() => setActiveTab("interns")}
                >
                    Programs
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === "moa" ? "border-b-2 border-black" : "text-gray-500"}`}
                    onClick={() => setActiveTab("moa")}
                >
                    Status of MOA
                </button>
            </nav>
        </div>
    );
}
