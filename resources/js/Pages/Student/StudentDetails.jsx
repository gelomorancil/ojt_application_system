import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useState, useEffect } from "react";

function StudentDetails() {
    const { student } = usePage().props;
    // Get saved company boxes from localStorage
    const [extraCompanies, setExtraCompanies] = useState(() => {
        return JSON.parse(localStorage.getItem(`extraCompanies_${student.Student_Num}`)) || [];
    });
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSchoolYear, setSelectedSchoolYear] = useState("");

    const currentYear = new Date().getFullYear();
    const schoolYears = Array.from({ length: 3 }, (_, i) => `${currentYear - 1 + i}-${currentYear + i}`);

    // Function to handle adding a new box
    const addCompanyBox = () => {
        setExtraCompanies([{ id: Date.now(), saved: false }, ...extraCompanies]);
    };

    const handleSave = async (id = null) => {
        // Prepare form data
        const formData = {
            student_id: student.Student_Num, // Ensure student ID is included
            company: selectedCompany,
            semester: selectedSemester,
            schoolYear: selectedSchoolYears,
        };
    
        console.log("Saving Data:", formData);
    
        try {
            const response = await fetch("/api/save-student-company", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Data saved successfully!");
    
                // If an `id` is provided, update extra companies as saved
                if (id !== null) {
                    const updatedCompanies = extraCompanies.map(company =>
                        company.id === id ? { ...company, saved: true } : company
                    );
                    setExtraCompanies(updatedCompanies);
                    localStorage.setItem(`extraCompanies_${student.Student_Num}`, JSON.stringify(updatedCompanies));
                }
            } else {
                alert("Error saving data: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to save data.");
        }
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

                            {/* Layout Container */}
                            <div className="flex gap-6 mt-4">
                                {/* Company Dropdown (Left Side) */}
                                <div className="w-1/2">
                                    <label className="block text-gray-700 font-medium">Company:</label>
                                    <select 
                                        className="mt-2 p-2 border rounded w-full bg-gray-100"
                                        value={selectedCompany}
                                        onChange={(e) => setSelectedCompany(e.target.value)} 
                                    >
                                        <option value="">Select a Company</option>
                                    </select>
                                </div>

                                {/* Semester & School Year (Stacked on Right) */}
                                <div className="w-1/2 flex flex-col gap-4">
                                    {/* Semester Dropdown */}
                                    <div>
                                        <label className="block text-gray-700 font-medium">Semester:</label>
                                        <select
                                            className="mt-2 p-2 border rounded w-full bg-gray-100"
                                            value={selectedSemester}
                                            onChange={(e) => setSelectedSemester(e.target.value)}
                                        >
                                            <option value="">Select Semester</option>
                                            <option value="1st">First</option>
                                            <option value="2nd">Second</option>
                                            <option value="Summer">Summer</option>
                                        </select>
                                    </div>

                                    {/* School Year Dropdown */}
                                    <div>
                                        <label className="block text-gray-700 font-medium">School Year:</label>
                                        <select
                                            className="mt-2 p-2 border rounded w-full bg-gray-100"
                                            value={selectedSchoolYear}
                                            onChange={(e) => setSelectedSchoolYear(e.target.value)}
                                        >
                                            <option value="">Select School Year</option>
                                            {schoolYears.map((year, index) => (
                                                <option key={index} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4 space-x-2">
                                {/* Save Button (Only shows if not saved yet) */}
                                {!company.saved && (
                                    <button
                                        onClick={() => handleSave(company.id)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
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

                        {/* Layout Container */}
                        <div className="flex gap-6 mt-4">
                            {/* Company Dropdown (Left Side) */}
                            <div className="w-1/2">
                                <label className="block text-gray-700 font-medium">Company:</label>
                                <select 
                                    className="mt-2 p-2 border rounded w-full bg-gray-100"
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)} 
                                >
                                    <option value="">Select a Company</option>
                                </select>
                            </div>

                            {/* Semester & School Year (Stacked on Right) */}
                            <div className="w-1/2 flex flex-col gap-4">
                                {/* Semester Dropdown */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Semester:</label>
                                    <select
                                        className="mt-2 p-2 border rounded w-full bg-gray-100"
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                    >
                                        <option value="">Select Semester</option>
                                        <option value="1st">First</option>
                                        <option value="2nd">Second</option>
                                        <option value="Summer">Summer</option>
                                    </select>
                                </div>

                                {/* School Year Dropdown */}
                                <div>
                                    <label className="block text-gray-700 font-medium">School Year:</label>
                                    <select
                                        className="mt-2 p-2 border rounded w-full bg-gray-100"
                                        value={selectedSchoolYear}
                                        onChange={(e) => setSelectedSchoolYear(e.target.value)} // ✅ Update state on change
                                    >
                                        <option value="">Select School Year</option>
                                        {schoolYears.map((year, index) => (
                                            <option key={index} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Dropdown */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Status:</label>
                                    <select
                                        className="mt-2 p-2 border rounded w-full bg-gray-100"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Denies">Denied</option>
                                        <option value="On going">On going</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/*Save Button*/}
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white text-m rounded-lg hover:bg-gray-500"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
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
