import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

function StudentDetails() {
    const { student } = usePage().props;
    // Get saved company boxes from localStorage
    const [extraCompanies, setExtraCompanies] = useState(() => {
        return JSON.parse(localStorage.getItem(`extraCompanies_${student.Student_Num}`)) || [];
    });

    // Function to handle adding a new box
    const addCompanyBox = () => {
        setExtraCompanies([{ id: Date.now(), saved: false }, ...extraCompanies]);
    };

    // Function to save a company box (so it persists)
    const handleSave = (id) => {
        const updatedCompanies = extraCompanies.map(company =>
            company.id === id ? { ...company, saved: true } : company
        );
        setExtraCompanies(updatedCompanies);
        localStorage.setItem(`extraCompanies_${student.Student_Num}`, JSON.stringify(updatedCompanies));
    };

    // Function to delete a company box
    const handleDelete = (id) => {
        const updatedCompanies = extraCompanies.filter(company => company.id !== id);
        setExtraCompanies(updatedCompanies);
        localStorage.setItem(`extraCompanies_${student.Student_Num}`, JSON.stringify(updatedCompanies));
    };


    return (
        <AuthenticatedLayout>
            <Head title="Student Details" />

            <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-3 gap-6">
                {/* Left Side (Student Details & Company Details) */}
                <div className="col-span-2 space-y-6">
                    {/* Student Details Box */}
                    <div className="bg-white p-6 shadow rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                                {/* Enlarged Student Photo */}
                                <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">Photo</span>
                                </div>

                                {/* Student Details */}
                                <div>
                                    <h1 className="text-2xl font-bold">{student?.Fname} {student?.Lname}</h1>
                                    <p><strong>Student Number:</strong> {student?.Student_Num ?? "N/A"}</p>
                                    <p><strong>College:</strong> {student?.College_Name ?? "Not Provided"}</p>
                                    <p><strong>Course:</strong> {student?.Course_Name ?? "Not Provided"}</p>
                                    <p><strong>OJT Hours:</strong> {student?.Ojt_Hours ?? "Not Provided"}</p>
                                </div>
                            </div>

                            {/* Right Side: Semester and School Year */}
                            <div className="text-right">
                                <p><strong>Semester:</strong> {student?.Semester ?? "Not Available"}</p>
                                <p><strong>School Year:</strong> {student?.Year ?? "Not Available"}</p>
                            </div>
                        </div>
                    </div>

                    {/* PLUS BUTTON ABOVE DEFAULT BOX */}
                    <div className="flex justify-center !mt-3">
                        <button
                            onClick={addCompanyBox}
                            className="w-20 h-8 bg-gray-400 text-white flex items-center justify-center rounded-lg hover:bg-gray-500"
                        >
                            +
                        </button>
                    </div>

                    {/* Dynamically Added Company Boxes (NEW ONES FIRST) */}
                    {extraCompanies.map((company) => (
                        <div key={company.id} className="bg-white p-6 shadow rounded-lg !mt-3">
                            <h2 className="text-lg font-semibold">Intern Applied Company</h2>
                            <p className="text-gray-600">Add new company information here.</p>
                            <div className="flex justify-end mt-4 space-x-2">
                                {/* Save Button (Only shows if not saved yet) */}
                                {!company.saved && (
                                    <button
                                        onClick={() => handleSave(company.id)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-red-500"
                                    >
                                        Save
                                    </button>
                                )}

                                {/* Delete Button (Always available) */}
                                <button
                                    onClick={() => handleDelete(company.id)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Default Company Box */}
                    <div className="bg-white p-6 shadow rounded-lg !mt-3">
                        <h2 className="text-lg font-semibold">Intern Applied Company</h2>
                        <p className="text-gray-600">Add company-related information here.</p>
                    </div>
                </div>

                {/* Right Side (Uploaded Files) */}
                <div className="bg-white p-6 shadow rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Uploaded Files</h2>
                    <p className="text-gray-500">No files uploaded yet.</p>
                </div>
            </div>
        </div>

        </AuthenticatedLayout>
    );
}

export default StudentDetails;
