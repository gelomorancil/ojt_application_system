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

const colleges = [
    { name: "CAS", code: "CAS" },
    { name: "CBA", code: "CBA" },
    { name: "CECS", code: "CECS" },
    { name: "CE", code: "CE" }
];

useEffect(() => {
    if (college) {
        axios.get(`/get-courses?college=${college}`).then((response) => {
            // Use Map to ensure only unique courses based on the "Course" field
            const uniqueCourses = Array.from(
                new Map(response.data.map(course => [course.Course, course])).values()
            );

            setCourses(uniqueCourses);
            setCourse(""); // Reset course selection when college changes
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
      setFile(e.target.files[0]); // Store file in state
  };

  // Fetch courses when a college is selected
  useEffect(() => {
    if (college) {
      axios.get(`/get-courses?college=${college}`).then((response) => {
        setCourses(response.data);
        setCourse(""); // Reset course selection when college changes
      });
    } else {
      setCourses([]);
      setCourse("");
    }
  }, [college]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure a file is selected
    if (!selectedFile) {
        console.error('No file selected');
        return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('file', selectedFile);
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

    } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
        alert('Upload failed. Check console for details.');
    }
};

    return (
        <AuthenticatedLayout>
            <Head title="Student Management" />

            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Student Uploading</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                {/* College Dropdown */}
                <div>
                    {/* College Dropdown */}
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

                    {/* Course Dropdown (Filtered Based on Selected College) */}
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
