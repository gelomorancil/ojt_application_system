import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Select from "react-select";

function CompanyForm({ company_list, onDelete, student }) {
    const { data, setData, post, processing, reset } = useForm({
        Comp_ID: "",
        Student_ID: student.id,
        Sem: "",
        AY: "",
        Status: "",
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student_comp.store'), { onSuccess: reset });
    };

    // Generate dynamic school years (-1, 0, +1)
    const currentYear = new Date().getFullYear();
    const schoolYears = [`${currentYear - 1}-${currentYear}`, `${currentYear}-${currentYear + 1}`, `${currentYear + 1}-${currentYear + 2}`];

    // Sort companies alphabetically
    const sortedCompanies = company_list.sort((a, b) => a.Comp_name.localeCompare(b.Comp_name));

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg mt-3">
            <div className="flex flex-wrap gap-6 mt-4">
                {/* Student ID Input */}
                <div className="w-1/2">
                    <label className="block text-gray-700 font-medium">Student ID:</label>
                    <input
                        type="text"
                        className="mt-2 p-2 border rounded w-full bg-gray-100"
                        // value={data.Student_ID}
                        value={student.Student_Num}
                        disabled
                        // onChange={(e) => setData("Student_ID", e.target.value)}
                        placeholder="Enter Student ID"
                    />
                </div>
                
                {/* Company Dropdown (Left Side) */}
                <div className="w-1/2">
                    <label className="block text-gray-700 font-medium">Company:</label>
                    <Select
                        placeholder="Select Company"
                        options={sortedCompanies.map(company => ({
                            value: company.id,
                            label: company.Comp_name
                        }))}
                        onChange={(e) => setData("Comp_ID", e.value)}
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
            <div className="flex justify-end mt-4 space-x-2">
                <button type="submit" className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                    Save
                </button>
                <button onClick={onDelete} className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500">
                    Delete
                </button>
            </div>
        </form>
    );
}

export default CompanyForm;
