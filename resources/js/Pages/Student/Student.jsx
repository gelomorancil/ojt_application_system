import { Head, useForm, router, Link } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";

export default function Student({ students = [], courses = [], colleges = [], availableYears = [], selectedYear }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [year, setYear] = useState(selectedYear || "");

    const { data, setData, post, put, processing, errors, reset } = useForm({
        College: "",
        Course: "",
        Fname: "",
        Lname: "",
        Student_Num: "",
        Hrs: "",
        Sem: "",
        Year: ""
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourseFilter, setSelectedCourseFilter] = useState("");
    const [showCourseFilter, setShowCourseFilter] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState("");

    const currentYear = new Date().getFullYear();
    const schoolYears = [`${currentYear - 1}-${currentYear}`, `${currentYear}-${currentYear + 1}`, `${currentYear + 1}-${currentYear + 2}`];

    const editStudent = (studentId) => {
        const studentToEdit = students.find(student => student.id === studentId);
        if (studentToEdit) {
            // First set the college
            setData({
                College: studentToEdit.College_Name || "",
                Course: "", // Temporarily set to empty
                Fname: studentToEdit.Fname || "",
                Lname: studentToEdit.Lname || "",
                Student_Num: studentToEdit.Student_Num || "",
                Hrs: studentToEdit.Hrs || "",
                Sem: studentToEdit.Sem || "",
                Year: studentToEdit.Year || "",
            });
            
            // Then set the course in a separate update to ensure college filtering has occurred
            setTimeout(() => {
                setData(prevData => ({
                    ...prevData,
                    Course: studentToEdit.Course_Name || ""
                }));
            }, 0);
            
            setIsEditing(true);
            setEditingStudentId(studentId);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!data.Student_Num || !data.Fname || !data.Lname || !data.College || !data.Course) {
            alert("Please fill in all required fields.");
            return;
        }

        if (isEditing) {
            // Update existing student
            put(route("student.update", editingStudentId), {
                onSuccess: () => {
                    alert("Student updated successfully.");
                    resetForm();
                },
                onError: (errors) => {
                    console.error("Update error:", errors);
                    alert("Failed to update student. Please check input fields.");
                }
            });
        } else {
            // Check for duplicates
            const isDuplicate = students.some(student => 
                student.Student_Num === data.Student_Num
            );

            if (isDuplicate) {
                alert("This student already exists.");
                return;
            }

            // Add new student
            post(route("student.store"), {
                onSuccess: () => {
                    alert("Student added successfully.");
                    resetForm();
                },
                onError: (errors) => {
                    console.error("Submission error:", errors);
                    alert("Failed to add student. Please check input fields.");
                },
            });
        }
    };

    const resetForm = () => {
        reset();
        setData({
            College: "",
            Course: "",
            Fname: "",
            Lname: "",
            Student_Num: "",
            Hrs: "",
            Sem: "",
            Year: ""
        });
        setIsEditing(false);
        setEditingStudentId(null);
    };

    const filteredCourses = useMemo(() => {
        if (!data.College) return [];
    
        // Get courses for the selected college
        const collegeCourses = courses.filter(course => course.College === data.College);
    
        // Ensure the pre-selected course (for editing) is included
        if (isEditing && editingStudentId) {
            const studentToEdit = students.find(student => student.id === editingStudentId);
            if (studentToEdit && studentToEdit.Course_Name && 
                !collegeCourses.some(course => course.Course === studentToEdit.Course_Name)) {
                collegeCourses.push({ 
                    Course: studentToEdit.Course_Name, 
                    College: studentToEdit.College_Name 
                });
            }
        }
    
        // Remove duplicates
        const uniqueCoursesMap = new Map();
        collegeCourses.forEach(course => {
            if (!uniqueCoursesMap.has(course.Course)) {
                uniqueCoursesMap.set(course.Course, course);
            }
        });
    
        return Array.from(uniqueCoursesMap.values());
    }, [data.College, courses, isEditing, editingStudentId, students]);   

    // Filter courses for dropdown based on selected college (for table filtering)
    const collegeFilteredCourses = useMemo(() => {
        if (!selectedCollege) return [];

        // Get courses for the selected college
        const collegeCourses = courses.filter(course => course.College === selectedCollege);

        // Remove duplicates by creating a Map with course name as key
        const uniqueCoursesMap = new Map();
        collegeCourses.forEach(course => {
            if (!uniqueCoursesMap.has(course.Course)) {
                uniqueCoursesMap.set(course.Course, course);
            }
        });

        // Convert the Map values back to an array
        return Array.from(uniqueCoursesMap.values());
    }, [selectedCollege, courses]);

    // Reset course selection when college changes
    useEffect(() => {
        setData('Course', '');
        setData('Hrs', '');
    }, [data.College]);

    // Reset course filter when college selection changes
    useEffect(() => {
        setSelectedCourseFilter('');
    }, [selectedCollege]);

    useEffect(() => {
        // Fetch OJT hours from the database
        axios.get("/api/ojt-hours") // Adjust API endpoint as needed
            .then(response => {
                const hoursData = response.data.reduce((acc, item) => {
                    acc[item.Course_Name] = item.Hours; // Map Course_Name to Hours
                    return acc;
                }, {});
                setOjtHours(hoursData);
            })
            .catch(error => console.error("Error fetching OJT hours:", error));
    }, []);

    // Update hours when course changes
    useEffect(() => {
        if (data.Course) {
            // Find the course in the courses array
            const selectedCourse = courses.find(
                course => course.College === data.College && course.Course === data.Course
            );
            
            // Set the hours based on the selected course
            if (selectedCourse && selectedCourse.Hours) {
                setData('Hrs', selectedCourse.Hours);
            } else {
                // If no hours defined, set a default value or leave empty
                setData('Hrs', '');
            }
        } else {
            setData('Hrs', '');
        }
    }, [data.Course, data.College, courses]);

    const handleSelection = (name, value) => {
        setData(name, value);
    
        if (name === "Course") {
            // Find the selected course
            const selectedCourse = courses.find(c => c.Course === value);
    
            if (selectedCourse) {
                // Update OJT Hours only, not affecting Year
                setData("Hrs", selectedCourse.Hours || "");
            } else {
                setData("Hrs", "");
            }
        }
    };    

    // Filter students based on selected college, search, and course filter
    const filteredStudents = useMemo(() => {
        // Only show students when a college is selected
        if (!selectedCollege) return [];

        // Filter students by selected college
        let result = students.filter(student =>
            student.College_Name === selectedCollege
        );

        // Apply search filter
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(student =>
                student.Student_Num.toLowerCase().includes(lowerSearchTerm) ||
                student.Fname.toLowerCase().includes(lowerSearchTerm) ||
                student.Lname.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // Apply course filter
        if (selectedCourseFilter) {
            result = result.filter(student =>
                student.Course_Name === selectedCourseFilter
            );
        }

        return result;
    }, [students, selectedCollege, searchTerm, selectedCourseFilter]);     

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this student?')) {
            axios.delete(`/student/${id}`)
                .then(() => {
                    alert('Student deleted successfully.');
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error deleting student:', error.response || error);
                    alert(error.response?.data?.message || 'Error deleting student.');
                });
        }
    };

    // Toggle course filter dropdown
    const toggleCourseFilter = () => {
        if (selectedCollege) {
            setShowCourseFilter(!showCourseFilter);
        }
    };

    return (
        <AuthenticatedLayout
            // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Student Management</h2>}
        >
            <Head title="Student Management" />

            <div className="py-12">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Form Section */}
                        <div className="w-1/4 bg-white shadow-sm rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {isEditing ? "Edit Student" : "Add Student"}
                            </h3>
                            <form onSubmit={handleSubmit}>
                            {[
                                { label: "Student Number", name: "Student_Num", type: "text" },
                                { label: "First Name", name: "Fname", type: "text" },                                
                                { label: "Last Name", name: "Lname", type: "text" },
                                { label: "College", name: "College", type: "select", options: colleges },
                                { label: "Course", name: "Course", type: "select", options: filteredCourses.map(c => c.Course) },
                                { label: "School Year", name: "Year", type: "select", options: schoolYears },
                            ].map(({ label, name, type, options, disabled }, index) => (
                                <div className="mb-4" key={`${name}-${index}`}>
                                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                                    {type === "select" ? (
                                        <select
                                            className="w-full border rounded-lg p-2"
                                            value={data[name]}
                                            onChange={(e) => setData(name, e.target.value)}
                                        >
                                            <option value="">Select {label}</option>
                                        
                                            { 
                                                name === "Course"
                                                ? filteredCourses.map((course, index) => (
                                                    <option key={`course-${index}`} value={course.Course}>
                                                        {course.Course}
                                                    </option>
                                                ))
                                                : // Default Dropdown (Generic Options)
                                                options.map((option, optIndex) => (
                                                    <option key={`${name}-option-${optIndex}`} value={option}>
                                                        {option}
                                                    </option>
                                                ))
                                            }
                                        </select>                                                                   
                                    ) : (
                                        <input
                                            type={type}
                                            className="w-full border rounded-lg p-2"
                                            value={data[name]}
                                            onChange={(e) => setData(name, e.target.value)}
                                            disabled={disabled}
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
                                    {isEditing ? "Update Student" : "Add Student"}
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

                        {/* Table Section */}
                        <div className="bg-white p-6 shadow rounded w-3/4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Student List</h2>

                                <div className="flex items-center space-x-4">
                                    {/* College Selection for Table */}
                                    <div>
                                        <select
                                            className="border rounded-lg px-4 py-2"
                                            value={selectedCollege}
                                            onChange={(e) => setSelectedCollege(e.target.value)}
                                        >
                                            <option value="">Select College</option>
                                            {colleges.map((college) => (
                                                <option key={college} value={college}>
                                                    {college}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by ID, First or Last Name..."
                                            className="border rounded-lg px-4 py-2 w-64"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            disabled={!selectedCollege}
                                        />
                                        <svg
                                            className={`absolute right-3 top-2.5 h-5 w-5 ${selectedCollege ? 'text-gray-400' : 'text-gray-300'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>

                                    {/* Course Filter */}
                                    <div className="relative">
                                        <button
                                            onClick={toggleCourseFilter}
                                            className={`flex items-center border rounded-lg px-3 py-2 ${!selectedCollege ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                            disabled={!selectedCollege}
                                        >
                                            <svg
                                                className={`h-5 w-5 mr-1 ${selectedCollege ? 'text-gray-600' : 'text-gray-400'}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                            </svg>
                                            Filter Course
                                            {selectedCourseFilter && (
                                                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                                                    {selectedCourseFilter}
                                                </span>
                                            )}
                                        </button>

                                        {showCourseFilter && selectedCollege && (
                                            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => {
                                                            setSelectedCourseFilter('');
                                                            setShowCourseFilter(false);
                                                        }}
                                                    >
                                                        All Courses
                                                    </button>
                                                    {collegeFilteredCourses.map(course => (
                                                        <button
                                                            key={course.id}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => {
                                                                setSelectedCourseFilter(course.Course);
                                                                setShowCourseFilter(false);
                                                            }}
                                                        >
                                                            {course.Course}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left"></th>
                                            <th className="px-4 py-2 text-left">Student Number</th>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">College</th>
                                            <th className="px-4 py-2 text-left">Course</th>
                                            <th className="px-4 py-2">OJT Hours</th>
                                            <th className="px-4 py-2">Semester</th>
                                            <th className="px-4 py-2">Year</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((student, index) => (
                                                <tr key={student.id} className="border-t">
                                                    <td className="px-4 py-2">{index + 1}</td>
                                                    <td className="px-4 py-2 text-black">
                                                        <Link href={route('student.show', student.id)} className="text-black">
                                                            {student.Student_Num}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-2">{`${student.Lname}, ${student.Fname}`}</td>
                                                    <td className="px-4 py-2">{student.College_Name || "N/A"}</td>
                                                    <td className="px-4 py-2">{student.Course_Name || "N/A"}</td>
                                                    <td className="px-4 py-2">{student.Ojt_Hours || "N/A"}</td>
                                                    <td className="px-4 py-2">{student.Semester || "N/A"}</td>                                             
                                                    <td className="px-4 py-2">{student.Year || student.School_Year || "N/A"}</td>
                                                    <td className="px-4 py-2">
                                                        <button onClick={() => editStudent(student.id)} className="text-blue-600 mr-4">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(student.id)} className="text-red-600">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                                                    {!selectedCollege ? (
                                                        "Please select a college to view students."
                                                    ) : (
                                                        searchTerm || selectedCourseFilter ?
                                                            "No students found matching your search criteria." :
                                                            "No students found for this college. Add a new student using the form."
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
            </div>
        </AuthenticatedLayout>
    );
}
