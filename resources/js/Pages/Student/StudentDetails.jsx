import React, { useState, useEffect, useCallback } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import Select from "react-select";

function StudentDetails({ company_list, details_list }) {
    const { student } = usePage().props;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        Comp_ID: "",
        Sem: "",
        AY: "",
    });

    const currentYear = new Date().getFullYear();
    const schoolYears = Array.from({ length: 3 }, (_, i) => `${currentYear - 1 + i}-${currentYear + i}`);

    // Use useCallback to memoize the initial state creation
    const getInitialExtraCompanies = useCallback(() => {
    const storedCompanies = localStorage.getItem(`extraCompanies_${student.Student_Num}`);
    return storedCompanies ? JSON.parse(storedCompanies) : [];
    }, [student.Student_Num]);

    const [extraCompanies, setExtraCompanies] = useState(getInitialExtraCompanies);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    // State for each dynamically added box
    const [dynamicCompanyStates, setDynamicCompanyStates] = useState(
        extraCompanies.map(() => ({
            selectedCompany: "",
            selectedSemester: "",
            selectedSchoolYear: "",
        }))
    );

    // Update localStorage whenever extraCompanies changes
    useEffect(() => {
        // localStorage.setItem(extraCompanies_${student.Student_Num}, JSON.stringify(extraCompanies));
    }, [extraCompanies, student.Student_Num]);

    // Memoized function to add company box
    const addCompanyBox = useCallback(() => {
        const newCompany = { id: Date.now(), saved: false };
        setExtraCompanies(prev => [newCompany, ...prev]);
        
        // Add a new state for the dynamically added box
        setDynamicCompanyStates(prev => [
            {
                selectedCompany: "",
                selectedSemester: "",
                selectedSchoolYear: "",
            },
            ...prev
        ]);
    }, []);

    // Memoized function to update dynamic company state
    const updateDynamicCompanyState = useCallback((index, field, value) => {
        setDynamicCompanyStates(prev => 
            prev.map((state, i) => 
                i === index ? { ...state, [field]: value } : state
            )
        );
    }, []);

    // Memoized function to handle delete
    const handleDelete = useCallback((id) => {
        // Remove from extraCompanies
        setExtraCompanies(prev => prev.filter(company => company.id !== id));
        
        // Remove corresponding state
        const indexToRemove = extraCompanies.findIndex(company => company.id === id);
        setDynamicCompanyStates(prev => prev.filter((_, index) => index !== indexToRemove));
    }, [extraCompanies]);

    return (
        <AuthenticatedLayout>
            <Head title="Student Details" />

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Student Information Section (Left, Takes 2 Columns) */}
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white p-6 shadow rounded-lg">
                            {/* Student info rendering */}
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 items-center">
                                    <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">Photo</span>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">{student?.Fname} {student?.Lname}</h1>
                                        <p><strong>Student Number:</strong> {student?.Student_Num ?? "N/A"}</p>
                                        <p><strong>College:</strong> {student?.College_Name ?? "Not Provided"}</p>
                                        <p><strong>Course:</strong> {student?.Course_Name ?? "Not Provided"}</p>
                                        <p><strong>OJT Hours:</strong> {student?.Ojt_Hours ?? "Not Provided"}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p><strong>Semester:</strong> {student?.Semester ?? "Not Available"}</p>
                                    <p><strong>School Year:</strong> {student?.Year ?? "Not Available"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Add New Company Button */}
                        <div className="flex justify-center !mt-3">
                            <button
                                onClick={addCompanyBox}
                                className="w-20 h-8 bg-gray-400 text-white flex items-center justify-center rounded-lg hover:bg-gray-500"
                            >
                                +
                            </button>
                        </div>

                        {/* Dynamically Added Company Boxes */}
                        {extraCompanies.map((company, index) => (
                            <div key={company.id} className="bg-white p-6 shadow rounded-lg mt-3">
                                <h2 className="text-lg font-semibold">Intern Applied Company</h2>
                                <p className="text-gray-600">Add new company information here.</p>

                                {/* Layout Container */}
                                <div className="flex flex-wrap gap-6 mt-4">
                                    {/* Company Dropdown (Left Side) */}
                                    <div className="w-1/2">
                                        <label className="block text-gray-700 font-medium">Company:</label>
                                        <Select
                                            placeholder="Company"
                                            options={company_list.map(company => ({
                                                value: company.id,
                                                label: company.Comp_name
                                            }))}
                                            onChange={(e) => setSelectedCompany(e.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Semester & School Year (Right Side) */}
                                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                                        {/* Semester Selection */}
                                        <div>
                                            <label className="block text-gray-700 font-medium">Semester:</label>
                                            <select
                                                className="mt-2 p-2 border rounded w-full bg-gray-100"
                                                value={dynamicCompanyStates[index]?.selectedSemester || ""}
                                                onChange={(e) => updateDynamicCompanyState(index, "selectedSemester", e.target.value)}
                                            >
                                                <option value="">Select Semester</option>
                                                <option value="1st">First</option>
                                                <option value="2nd">Second</option>
                                                <option value="Summer">Summer</option>
                                            </select>
                                        </div>

                                        {/* School Year Selection */}
                                        <div>
                                            <label className="block text-gray-700 font-medium">School Year:</label>
                                            <select
                                                className="mt-2 p-2 border rounded w-full bg-gray-100"
                                                value={dynamicCompanyStates[index]?.selectedSchoolYear || ""}
                                                onChange={(e) => updateDynamicCompanyState(index, "selectedSchoolYear", e.target.value)}
                                            >
                                                <option value="">Select School Year</option>
                                                {schoolYears.map((year, yearIndex) => (
                                                    <option key={yearIndex} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Status Dropdown */}
                                        <div>
                                            <label className="block text-gray-700 font-medium">Status:</label>
                                            <select
                                                className="mt-2 p-2 border rounded w-full bg-gray-100"
                                                value={dynamicCompanyStates[index]?.status || ""}
                                                onChange={(e) => updateDynamicCompanyState(index, "status", e.target.value)}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Denied">Denied</option>
                                                <option value="On going">On going</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Save and Delete Buttons */}
                                <div className="flex justify-end mt-4 space-x-2">
                                    {!company.saved && (
                                        <>
                                            <button 
                                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => handleDelete(company.id)}
                                                className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Default Company Box */}
                        <div className="bg-white p-6 shadow rounded-lg mt-3">
                            <h2 className="text-lg font-semibold">Intern Applied Company</h2>
                            <p className="text-gray-600">Add company-related information here.</p>

                            {/* Layout Container */}
                            <div className="flex flex-wrap gap-6 mt-4">
                                {/* Company Dropdown (Left Side) */}
                                <div className="w-1/2">
                                    <label className="block text-gray-700 font-medium">Company:</label>
                                    <Select
                                        placeholder="Company"
                                        options={company_list.map(company => ({
                                            value: company.id,
                                            label: company.Comp_name
                                        }))}
                                        onChange={(e) => setSelectedCompany(e.value)}
                                        className="w-full"
                                    />
                                </div>

                                {/* Semester & School Year (Right Side) */}
                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium">Semester:</label>
                                        <select
                                            className="mt-2 p-2 border rounded w-full bg-gray-100"
                                            value={data.Sem}
                                            onChange={(e) => setData("Sem", e.target.value)}
                                        >
                                            <option value="">Select Semester</option>
                                            <option value="1st">First</option>
                                            <option value="2nd">Second</option>
                                            <option value="Summer">Summer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium">School Year:</label>
                                        <select
                                            className="mt-2 p-2 border rounded w-full bg-gray-100"
                                            value={data.AY}
                                            onChange={(e) => setData("AY", e.target.value)}
                                        >
                                            <option value="">Select School Year</option>
                                            {schoolYears.map((year, index) => (
                                                <option key={index} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium">Status:</label>
                                        <select
                                            className="mt-2 p-2 border rounded w-full bg-gray-100"
                                            value={data.Status}
                                            onChange={(e) => setData("Status", e.target.value)}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Denied">Denied</option>
                                            <option value="On going">On going</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end mt-4">
                                <button 
                                    
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Right Section: Upload Files */}
                        <div className="col-span-1 bg-white p-6 shadow rounded-lg">
                            <h2 className="text-lg font-semibold">Upload Files</h2>
                            <p className="text-gray-500">Upload your OJT-related documents here.</p>
                        </div>
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}

export default StudentDetails;