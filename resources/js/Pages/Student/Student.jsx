import { Head, useForm, router, Link } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";

export default function Student({ students = [], courses = [], colleges = [], availableYears = [], selectedYear }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [year, setYear] = useState(selectedYear || "");
    const [selectedStudents, setSelectedStudents] = useState([]);

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
    // New state for year filter
    const [selectedYearFilter, setSelectedYearFilter] = useState("");
    const [showYearFilter, setShowYearFilter] = useState(false);

    const currentYear = new Date().getFullYear();
    const schoolYears = [`${currentYear - 1}-${currentYear}`, `${currentYear}-${currentYear + 1}`, `${currentYear + 1}-${currentYear + 2}`];
    
    // Get unique years from the students array for filtering
    const uniqueYears = useMemo(() => {
        const yearsSet = new Set();
        
        students.forEach(student => {
            if (student.Year || student.School_Year) {
                yearsSet.add(student.Year || student.School_Year);
            }
        });
        
        // Add the school years to the set as well
        schoolYears.forEach(year => yearsSet.add(year));
        
        return Array.from(yearsSet).sort();
    }, [students, schoolYears]);

    // Add these new state variables for the export modal
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportCollege, setExportCollege] = useState("");
    const [exportCourse, setExportCourse] = useState("");
    const [exportYear, setExportYear] = useState("");
    const [exportLoading, setExportLoading] = useState(false);
    
    // Filter courses for the export dropdown
    const exportFilteredCourses = useMemo(() => {
        if (!exportCollege) return [];
        return courses.filter(course => course.College === exportCollege);
    }, [exportCollege, courses]);
    
    // Handle export form submission
    const handleExport = async (e) => {
        e.preventDefault();
        setExportLoading(true);
        
        try {
            // Create a form data object
            const formData = new FormData();
            if (exportCollege) formData.append('college', exportCollege);
            if (exportCourse) formData.append('course', exportCourse);
            if (exportYear) formData.append('year', exportYear);
            
            // Send a POST request to the export endpoint
            const response = await axios.post('/student/export', formData, {
                responseType: 'blob', // Important for file download
            });
            
            // Create a download link and click it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Generate a filename based on the selected filters
            let filename = 'students';
            if (exportCollege) filename += `_${exportCollege}`;
            if (exportCourse) filename += `_${exportCourse}`;
            if (exportYear) filename += `_${exportYear}`;
            filename += '.xlsx';
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            
            // Close the modal
            setShowExportModal(false);
            setExportCollege("");
            setExportCourse("");
            setExportYear("");
        } catch (error) {
            console.error('Export error:', error);
            alert('Error exporting student data');
        } finally {
            setExportLoading(false);
        }
    };
    
    // Reset export form when college changes
    useEffect(() => {
        setExportCourse("");
    }, [exportCollege]);

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
                Year: studentToEdit.Year || studentToEdit.School_Year || "",
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

    // Filter students based on selected college, search, course filter, and year filter
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
        
        // Apply year filter
        if (selectedYearFilter) {
            result = result.filter(student =>
                (student.Year || student.School_Year) === selectedYearFilter
            );
        }
        
        // Deduplicate students by Student_Num
        const uniqueStudents = [];
        const seenStudentNums = new Set();
        
        result.forEach(student => {
            if (!seenStudentNums.has(student.Student_Num)) {
                seenStudentNums.add(student.Student_Num);
                uniqueStudents.push(student);
            }
        });
        
        return uniqueStudents;
    }, [students, selectedCollege, searchTerm, selectedCourseFilter, selectedYearFilter]);

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

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId) 
                : [...prev, studentId]
        );
    };
    
    const toggleAllStudents = () => {
        if (selectedStudents.length === sortedStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(sortedStudents.map(student => student.id));
        }
    };
    
    const handleBatchDelete = async () => {
        if (selectedStudents.length === 0) {
            alert("Please select at least one student to delete.");
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${selectedStudents.length} selected student(s)?`)) {
            try {
                const response = await axios.post('/student/batch-delete', { 
                    studentIds: selectedStudents 
                });
                
                if (response.data.success) {
                    alert(response.data.message);
                    window.location.reload();
                } else {
                    alert(response.data.message || "Some students could not be deleted due to active transactions.");
                }
            } catch (error) {
                console.error('Error batch deleting students:', error.response || error);
                alert(error.response?.data?.message || 'Error deleting students.');
            }
        }
    };

    // Toggle course filter dropdown
    const toggleCourseFilter = () => {
        if (selectedCollege) {
            setShowCourseFilter(!showCourseFilter);
            // Close year filter if open
            if (showYearFilter) setShowYearFilter(false);
        }
    };

    // Toggle year filter dropdown
    const toggleYearFilter = () => {
        if (selectedCollege) {
            setShowYearFilter(!showYearFilter);
            // Close course filter if open
            if (showCourseFilter) setShowCourseFilter(false);
        }
    };

    const [showCombinedFilter, setShowCombinedFilter] = useState(false);

    const toggleCombinedFilter = () => {
    if (selectedCollege) {
        setShowCombinedFilter(!showCombinedFilter);
    }
    };

    const sortedStudents = useMemo(() => {
        return [...filteredStudents].sort((a, b) => 
            a.Lname.localeCompare(b.Lname)
        );
    }, [filteredStudents]);

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
                                    {/* College Selection */}
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

                                    {/* Export Button */}
                                    <button
                                    onClick={() => setShowExportModal(true)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                                    >
                                    <svg 
                                        className="h-5 w-5 mr-2" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export to Excel
                                    </button>

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

                                    {/* Combined Course & Year Filter */}
                                    <div className="relative">
                                    <button
                                        onClick={toggleCombinedFilter}
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
                                        Filters
                                        {(selectedCourseFilter || selectedYearFilter) && (
                                        <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                                            {selectedCourseFilter && selectedYearFilter 
                                            ? `${selectedCourseFilter}, ${selectedYearFilter}` 
                                            : selectedCourseFilter || selectedYearFilter}
                                        </span>
                                        )}
                                    </button>

                                    {showCombinedFilter && selectedCollege && (
                                        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                        <div className="p-3">
                                            {/* Course Filter Section */}
                                            <div className="mb-3">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Course</h3>
                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                                <div 
                                                className={`px-2 py-1 rounded cursor-pointer ${selectedCourseFilter === '' ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                                                onClick={() => setSelectedCourseFilter('')}
                                                >
                                                All Courses
                                                </div>
                                                {collegeFilteredCourses.map(course => (
                                                <div
                                                    key={course.id}
                                                    className={`px-2 py-1 rounded cursor-pointer ${selectedCourseFilter === course.Course ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                                                    onClick={() => setSelectedCourseFilter(course.Course)}
                                                >
                                                    {course.Course}
                                                </div>
                                                ))}
                                            </div>
                                            </div>
                                            
                                            {/* Year Filter Section */}
                                            <div className="mb-3">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Year</h3>
                                            <div className="space-y-1">
                                                <div 
                                                className={`px-2 py-1 rounded cursor-pointer ${selectedYearFilter === '' ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                                                onClick={() => setSelectedYearFilter('')}
                                                >
                                                All Years
                                                </div>
                                                {uniqueYears.map((year, index) => (
                                                <div
                                                    key={`year-${index}`}
                                                    className={`px-2 py-1 rounded cursor-pointer ${selectedYearFilter === year ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                                                    onClick={() => setSelectedYearFilter(year)}
                                                >
                                                    {year}
                                                </div>
                                                ))}
                                            </div>
                                            </div>
                                            
                                            {/* Apply & Clear Buttons */}
                                            <div className="flex justify-end pt-2 border-t">
                                            <button
                                                className="text-sm text-gray-600 hover:text-gray-800 mr-3"
                                                onClick={() => {
                                                setSelectedCourseFilter('');
                                                setSelectedYearFilter('');
                                                }}
                                            >
                                                Clear
                                            </button>
                                            <button
                                                className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                                onClick={() => setShowCombinedFilter(false)}
                                            >
                                                Apply
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                                    )}
                                    </div>

                                    {/* Delete Selected Button */}
                                    {selectedStudents.length > 0 && (
                                    <button
                                        onClick={handleBatchDelete}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                                    >
                                        <svg 
                                        className="h-5 w-5 mr-2" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Selected ({selectedStudents.length})
                                    </button>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left">
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedStudents.length === sortedStudents.length && sortedStudents.length > 0}
                                                    onChange={toggleAllStudents}
                                                    disabled={sortedStudents.length === 0}
                                                    className="rounded"
                                                />
                                            </th>
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
                                        {sortedStudents.length > 0 ? (
                                            sortedStudents.map((student, index) => (
                                                <tr key={student.id} className="border-t">
                                                    <td className="px-4 py-2">
                                                        <input 
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(student.id)}
                                                            onChange={() => toggleStudentSelection(student.id)}
                                                            className="rounded"
                                                        />
                                                    </td>
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
                                                        searchTerm || selectedCourseFilter || selectedYearFilter ?
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
        {/* Export Modal */}
        {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
                        <h3 className="text-xl font-semibold mb-4">Export Students to Excel</h3>
                        <form onSubmit={handleExport}>
                            {/* College Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">College (Optional)</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={exportCollege}
                                    onChange={(e) => setExportCollege(e.target.value)}
                                >
                                    <option value="">All Colleges</option>
                                    {colleges.map((college) => (
                                        <option key={college} value={college}>
                                            {college}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Course Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course (Optional)</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={exportCourse}
                                    onChange={(e) => setExportCourse(e.target.value)}
                                    disabled={!exportCollege}
                                >
                                    <option value="">All Courses</option>
                                    {exportFilteredCourses.map((course, index) => (
                                        <option key={`export-course-${index}`} value={course.Course}>
                                            {course.Course}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* School Year Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">School Year (Optional)</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={exportYear}
                                    onChange={(e) => setExportYear(e.target.value)}
                                >
                                    <option value="">All Years</option>
                                    {schoolYears.map((year, index) => (
                                        <option key={`export-year-${index}`} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowExportModal(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                    disabled={exportLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                                    disabled={exportLoading}
                                >
                                    {exportLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Exporting...
                                        </>
                                    ) : (
                                        "Export"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}