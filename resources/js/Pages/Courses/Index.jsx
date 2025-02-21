import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Index = ({ courses }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCollege, setSelectedCollege] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const deleteCourse = (id) => {
        if (confirm("Are you sure you want to delete this course?")) {
            router.delete(`/courses/${id}`);
        }
    };

    const filteredCourses = courses.filter(course =>
        (course.College.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Course.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCollege === "" || course.College === selectedCollege) &&
        (selectedYear === "" || (course.ojt_hours && course.ojt_hours.Year === selectedYear))
    );

    const uniqueColleges = [...new Set(courses.map(course => course.College))];
    const uniqueYears = [...new Set(courses.map(course => course.ojt_hours ? course.ojt_hours.Year : null).filter(year => year !== null))];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Courses</h2>}
        >
            <Head title="Courses" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between mb-4">
                                <a
                                    href="/courses/create"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Add New Course
                                </a>
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <select
                                        className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedCollege}
                                        onChange={(e) => setSelectedCollege(e.target.value)}
                                    >
                                        <option value="">All Colleges</option>
                                        {uniqueColleges.map(college => (
                                            <option key={college} value={college}>{college}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option value="">All Years</option>
                                        {uniqueYears.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OJT Hours</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCourses.map((course) => (
                                            <tr key={course.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.College}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.Course}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {course.ojt_hours ? course.ojt_hours.Hrs : <span className="text-gray-500">No OJT hours</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {course.ojt_hours ? course.ojt_hours.Sem : <span className="text-gray-500">-</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {course.ojt_hours ? course.ojt_hours.Year : <span className="text-gray-500">-</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <a
                                                            href={`/courses/edit/${course.id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Edit
                                                        </a>
                                                        <button
                                                            onClick={() => deleteCourse(course.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
