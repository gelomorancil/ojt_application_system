import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function StudentUploading() {
    const [file, setFile] = useState(null);
    const [college, setCollege] = useState("");
    const [course, setCourse] = useState("");
    const [courses, setCourses] = useState([]);
    const [schoolYear, setSchoolYear] = useState("");
    const [semester, setSemester] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const colleges = [
        { name: "CAS", code: "CAS" },
        { name: "CBA", code: "CBA" },
        { name: "CECS", code: "CECS" },
        { name: "CE", code: "CE" }
    ];

    useEffect(() => {
        if (college) {
            axios.get(`/get-courses?college=${college}`).then((response) => {
                const uniqueCourses = Array.from(
                    new Map(response.data.map(course => [course.Course, course])).values()
                );

                setCourses(uniqueCourses);
                setCourse(""); // Reset course selection when college changes
            }).catch(error => {
                console.error("Error fetching courses:", error);
                setErrorMessage("Failed to fetch courses. Please try again.");
            });
        } else {
            setCourses([]);
            setCourse("");
        }
    }, [college]);

    // School year logic
    const currentYear = new Date().getFullYear();
    const schoolYearOptions = [
        `${currentYear - 1}-${currentYear}`,
        `${currentYear}-${currentYear + 1}`,
        `${currentYear + 1}-${currentYear + 2}`,
    ];

    // Handle file change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setErrorMessage(""); // Clear any previous error messages
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Reset error message

        // Ensure all fields are filled
        if (!file || !college || !course || !schoolYear || !semester) {
            setErrorMessage("Please fill in all fields and select a file.");
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('file', file);
        formData.append('college', college);
        formData.append('course', course);
        formData.append('schoolYear', schoolYear);
        formData.append('semester', semester);

        try {
            // Send request to Laravel backend
            const response = await axios.post('/upload-students', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Success:', response.data);
            alert('Upload successful!'); // Show success message
            
            // Optional: Reset form after successful upload
            setFile(null);
            setCollege("");
            setCourse("");
            setSchoolYear("");
            setSemester("");

        } catch (error) {
            console.error('Upload failed:', error);
            
            // More detailed error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMsg = error.response.data.message || 
                                 error.response.data.error || 
                                 'Upload failed. Please check the file and try again.';
                setErrorMessage(errorMsg);
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                setErrorMessage('No response received from the server. Please check your network connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setErrorMessage('Error setting up the upload. Please try again.');
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Management" />

            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Student Uploading</h2>

                {/* Error Message Display */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rest of the form remains the same as in previous example */}
                    {/* College Dropdown */}
                    <div>
                        <label className="block font-medium">College</label>
                        <select
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select a college</option>
                            {colleges.map((col) => (
                                <option key={col.code} value={col.code}>
                                    {col.name}
                                </option>
                            ))}
                        </select>

                        {/* Course Dropdown */}
                        <label className="block font-medium">Course</label>
                        <select
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                            disabled={!college}
                        >
                            <option value="">Select a course</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.Course}>
                                    {c.Course}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* School Year Dropdown */}
                    <div>
                        <label className="block font-medium">School Year</label>
                        <select
                            value={schoolYear}
                            onChange={(e) => setSchoolYear(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select school year</option>
                            {schoolYearOptions.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Semester Dropdown */}
                    <div>
                        <label className="block font-medium">Semester</label>
                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select semester</option>
                            <option value="1st">First</option>
                            <option value="2nd">Second</option>
                            <option value="Summer">Summer</option>
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block font-medium">Upload File</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                            accept=".xlsx,.xls,.csv"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                    >
                        Upload
                    </button>
                </form>

                {/* File Preview */}
                {file && (
                    <div className="mt-4 p-3 bg-gray-100 border rounded">
                        <p className="font-medium">Selected File:</p>
                        <p className="text-gray-700">{file.name}</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}