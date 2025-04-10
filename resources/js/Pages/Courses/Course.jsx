import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Course = ({ courses, course = null }) => {
    const [selectedCollege, setSelectedCollege] = useState(""); // Track selected college
    const [searchTerm, setSearchTerm] = useState(""); // For search functionality
    const [showFilters, setShowFilters] = useState(false); // Toggle filter dropdown
    const [selectedSemester, setSelectedSemester] = useState(""); // Filter by semester
    const [selectedYear, setSelectedYear] = useState(""); // Filter by school year
    const [isEditing, setIsEditing] = useState(false); // Track if we're editing or adding
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editingOjtHoursId, setEditingOjtHoursId] = useState(null);

    const currentYear = new Date().getFullYear();
    const schoolYears = [`${currentYear - 1}-${currentYear}`, `${currentYear}-${currentYear + 1}`, `${currentYear + 1}-${currentYear + 2}`];
    
    // Initialize form with data from the course if editing
    const { data, setData, post, put, processing, errors, reset } = useForm({
        College: "",
        Course: "",
        Hrs: "",
        Sem: "",
        Year: "",
    });

    // Set editing mode if a course is provided for editing
    useEffect(() => {
        if (course) {
            setIsEditing(true);
            // Initialize with the first OJT hours record
            if (course.ojt_hours && course.ojt_hours.length > 0) {
                const firstOjtHours = course.ojt_hours[0];
                setData({
                    College: course.College || "",
                    Course: course.Course || "",
                    Hrs: firstOjtHours.Hrs || "",
                    Sem: firstOjtHours.Sem || "",
                    Year: firstOjtHours.Year || "",
                });
                setEditingOjtHoursId(firstOjtHours.id);
            } else {
                setData({
                    College: course.College || "",
                    Course: course.Course || "",
                    Hrs: "",
                    Sem: "",
                    Year: "",
                });
            }
        }
    }, [course]);

    const editCourse = (courseId, ojtHoursId = null) => {
        // Find the course to edit
        const courseToEdit = courses.find(c => c.id === courseId);
        
        if (courseToEdit) {
            // Find the specific OJT hours record if provided
            let ojtHoursRecord = null;
            if (ojtHoursId && courseToEdit.ojt_hours) {
                ojtHoursRecord = courseToEdit.ojt_hours.find(h => h.id === ojtHoursId);
            } else if (courseToEdit.ojt_hours && courseToEdit.ojt_hours.length > 0) {
                // Use the first OJT hours record if none specified
                ojtHoursRecord = courseToEdit.ojt_hours[0];
            }
            
            // Populate the form with the course data
            setData({
                College: courseToEdit.College || "",
                Course: courseToEdit.Course || "",
                Hrs: ojtHoursRecord?.Hrs || "",
                Sem: ojtHoursRecord?.Sem || "",
                Year: ojtHoursRecord?.Year || "",
            });
            
            // Set editing mode and remember course ID for update
            setIsEditing(true);
            setEditingCourseId(courseId);
            setEditingOjtHoursId(ojtHoursRecord?.id);
        }
    };

    // handleSubmit function
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            // Update existing course
            put(route("course.update", editingCourseId), {
                onSuccess: () => {
                    console.log("Course updated successfully!");
                    alert("Course updated successfully!");
                    resetForm();
                },
                onError: (errors) => {
                    console.error("Update error:", errors);
                    alert("Failed to update course. Please check input fields.");
                },
            });
        } else {
            // Check if course name already exists (regardless of year/semester)
            const existingCourse = (Array.isArray(courses) ? courses : []).find(
                (c) => c.Course.trim().toLowerCase() === data.Course.trim().toLowerCase()
            );
            
            if (existingCourse) {
                // If exists, ask to update instead of creating new
                if (confirm(`The course "${data.Course}" already exists. Would you like to add a new semester/year to the existing course?`)) {
                    // Set form to edit mode with existing course data
                    setIsEditing(true);
                    setEditingCourseId(existingCourse.id);
                    setEditingOjtHoursId(null); // Creating a new OJT hours record
                    
                    // Update the form with existing course data but new semester/year values
                    setData({
                        College: existingCourse.College,
                        Course: existingCourse.Course,
                        Hrs: data.Hrs, // Preserve entered hours
                        Sem: data.Sem, // Preserve entered semester
                        Year: data.Year, // Preserve entered year
                    });
                    
                    // Submit the update
                    setTimeout(() => {
                        put(route("course.update", existingCourse.id), {
                            onSuccess: () => {
                                console.log("Course updated successfully!");
                                alert("Course updated successfully!");
                                resetForm();
                            },
                            onError: (errors) => {
                                console.error("Update error:", errors);
                                alert("Failed to update course. Please check input fields.");
                            },
                        });
                    }, 100);
                    
                    return;
                } else {
                    return; // User chose not to update, cancel operation
                }
            }
            
            // Add new course if no duplicate was found
            post(route("course.store"), {
                onSuccess: () => {
                    console.log("Course added successfully!");
                    alert("Course added successfully!");
                    resetForm();
                },
                onError: (errors) => {
                    console.error("Submission error:", errors);
                    alert("Failed to add course. Please check input fields.");
                },
            });
        }
    };

    // Make sure your resetForm function resets the editingCourseId
    const resetForm = () => {
        reset();
        setIsEditing(false);
        setEditingCourseId(null);
        setEditingOjtHoursId(null);
    };
    
    const deleteCourse = (id) => {
        if (confirm("Are you sure you want to delete this course?")) {
            router.delete(route("course.destroy", id));
        }
    };

    // Filter courses based on selected college, search term, semester and year
    const filteredCourses = selectedCollege
        ? courses.filter(course => {
            // First filter by college
            if (course.College !== selectedCollege) return false;

            // Then filter by search term (course name)
            if (searchTerm && !course.Course.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            // For semester and year filters, we need to check the ojt_hours array
            if (selectedSemester || selectedYear) {
                // Check if any of the ojt_hours records match our filters
                return course.ojt_hours.some(hours => {
                    // Filter by semester if selected
                    if (selectedSemester && hours.Sem !== selectedSemester) return false;
                    
                    // Filter by year if selected
                    if (selectedYear && hours.Year !== selectedYear) return false;
                    
                    return true;
                });
            }

            return true;
        })
        : []; // Empty array if no college is selected

    // Get unique semesters and years for filter options from all courses
    const getAllSemesters = () => {
        const semesters = new Set();
        courses.forEach(course => {
            if (course.College === selectedCollege && course.ojt_hours) {
                course.ojt_hours.forEach(hours => {
                    if (hours.Sem) semesters.add(hours.Sem);
                });
            }
        });
        return [...semesters];
    };

    const getAllYears = () => {
        const years = new Set();
        courses.forEach(course => {
            if (course.College === selectedCollege && course.ojt_hours) {
                course.ojt_hours.forEach(hours => {
                    if (hours.Year) years.add(hours.Year);
                });
            }
        });
        return [...years];
    };

    const uniqueSemesters = getAllSemesters();
    const uniqueYears = getAllYears();

    return (
        <AuthenticatedLayout>
            <Head title="Course Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Form Section */}
                        <div className="w-1/4 bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {isEditing ? "Edit Course" : "Add Course"}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                {[
                                    { label: "College", name: "College", type: "select", options: ["CECS", "CAS", "CBA", "CE", "CON"] },
                                    { label: "Course", name: "Course", type: "text" },
                                    { label: "OJT Hours", name: "Hrs", type: "number", min: 0, step: 10 },
                                    { label: "Semester", name: "Sem", type: "select", options: ["First", "Second", "Summer"] },
                                    { label: "Year", name: "Year", type: "select", options: ["1st", "2nd", "3rd", "4th"] },
                                ].map(({ label, name, type, options, ...rest }) => (
                                    <div className="mb-4" key={name}>
                                        <label className="block text-sm font-medium text-gray-700">{label}</label>
                                        {type === "select" ? (
                                            <select
                                                className="w-full border rounded-lg p-2"
                                                value={data[name]}
                                                onChange={(e) => setData(name, e.target.value)}
                                            >
                                                <option value="">Select {label}</option>
                                                {options.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={type}
                                                className="w-full border rounded-lg p-2"
                                                value={data[name]}
                                                onChange={(e) => setData(name, e.target.value)}
                                                {...rest}
                                            />
                                        )}
                                        {errors[name] && <p className="text-red-500">{errors[name]}</p>}
                                    </div>
                                ))}

                                <div className="mt-4 flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-gray-400 text-white px-4 py-2 rounded"
                                    >
                                        {isEditing ? "Update Course" : "Add Course"}
                                    </button>
                                    
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Courses Table Section */}
                        <div className="bg-white p-6 shadow rounded w-3/4">
                            {/* Header & College Filter */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="relative">
                                <select
                                    className="border rounded-lg px-4 py-2"
                                    value={selectedCollege}
                                    onChange={(e) => {
                                        setSelectedCollege(e.target.value);
                                        // Reset filters when changing college
                                        setSelectedSemester("");
                                        setSelectedYear("");
                                    }}
                                >
                                    <option value="">Select College</option>
                                    {["CECS", "CAS", "CBA", "CE", "CON"].map(college => (
                                        <option key={college} value={college}>{college}</option>
                                    ))}
                                </select>
                                </div>

                                {/* Search and Filter Section */}
                                <div className="flex items-center">
                                    <div className="relative mr-2">
                                        <input
                                            type="text"
                                            placeholder="Search courses..."
                                            className="border rounded-lg px-4 py-2"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            disabled={!selectedCollege}
                                        />
                                    </div>

                                    {/* Filter Icon with Dropdown */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className={`px-3 py-2 border rounded-lg ${selectedCollege ? 'bg-gray-100' : 'bg-gray-100 opacity-50 cursor-not-allowed'}`}
                                            onClick={() => selectedCollege && setShowFilters(!showFilters)}
                                            disabled={!selectedCollege}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                        </button>

                                        {/* Filter Dropdown */}
                                        {showFilters && selectedCollege && (
                                            <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white z-10 border p-4">
                                                <h4 className="font-semibold mb-2">Filters</h4>

                                                {/* Semester Filter */}
                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                                    <select
                                                        className="w-full border rounded-lg p-2"
                                                        value={selectedSemester}
                                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                                    >
                                                        <option value="">All Semesters</option>
                                                        {uniqueSemesters.map(sem => (
                                                            <option key={sem} value={sem}>{sem}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Year Filter */}
                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                                    <select
                                                        className="w-full border rounded-lg p-2"
                                                        value={selectedYear}
                                                        onChange={(e) => setSelectedYear(e.target.value)}
                                                    >
                                                        <option value="">All Years</option>
                                                        {uniqueYears.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Reset Filters button */}
                                                <button
                                                    className="w-full bg-gray-100 text-gray-800 px-3 py-1 rounded mt-2"
                                                    onClick={() => {
                                                        setSelectedSemester("");
                                                        setSelectedYear("");
                                                        setSearchTerm("");
                                                    }}
                                                >
                                                    Reset Filters
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Courses Table */}
                            <table className="min-w-full border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">College</th>
                                        <th className="px-4 py-2">Course</th>
                                        <th className="px-4 py-2">OJT Hours</th>
                                        <th className="px-4 py-2">Semester</th>
                                        <th className="px-4 py-2">Year</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.length > 0 ? (
                                        filteredCourses.flatMap((course) => 
                                            // For each course, create a row for each OJT hours record
                                            course.ojt_hours.length > 0 ? 
                                                course.ojt_hours.map((hours, hourIndex) => (
                                                    <tr key={`${course.id}-${hours.id}`} className="border-t">
                                                        {/* Only show college and course name in the first row of each course */}
                                                        <td className="px-4 py-2">
                                                            {course.College}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {course.Course}
                                                        </td>
                                                        <td className="px-4 py-2">{hours.Hrs || "N/A"}</td>
                                                        <td className="px-4 py-2">{hours.Sem || "N/A"}</td>
                                                        <td className="px-4 py-2">{hours.Year || "N/A"}</td>
                                                        <td className="px-4 py-2">
                                                            <button 
                                                                onClick={() => editCourse(course.id, hours.id)} 
                                                                className="text-blue-600 mr-4"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteCourse(course.id)} 
                                                                className="text-red-600"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    // For courses with no OJT hours, show a single row
                                                    <tr key={course.id} className="border-t">
                                                        <td className="px-4 py-2">{course.College}</td>
                                                        <td className="px-4 py-2">{course.Course}</td>
                                                        <td className="px-4 py-2">N/A</td>
                                                        <td className="px-4 py-2">N/A</td>
                                                        <td className="px-4 py-2">N/A</td>
                                                        <td className="px-4 py-2">
                                                            <button onClick={() => editCourse(course.id)} className="text-blue-600 mr-4">Edit</button>
                                                            <button onClick={() => deleteCourse(course.id)} className="text-red-600">Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                            {!selectedCollege ? (
                                                "Please select a college to view courses."
                                            ) : (
                                                filteredCourses.length === 0 ?
                                                    (searchTerm || selectedSemester || selectedYear ? 
                                                        "No courses found matching your search criteria." :
                                                        "No courses found for this college."
                                                    ) :
                                                    null
                                            )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Course;