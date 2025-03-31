import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";

export default function StudentUploading() {
    const [college, setCollege] = useState("");
    const [courses, setCourses] = useState([]);

    const colleges = [
        { name: "CAS", code: "CAS" },
        { name: "CBA", code: "CBA" },
        { name: "CECS", code: "CECS" },
        { name: "CON", code: "CON" },
        { name: "CE", code: "CE" }
    ];

    // useForm hook moved outside of a nested function
    const { data, setData, post, reset, errors } = useForm({
        college: "",
        course: "",
        schoolYear: "",
        semester: "",
        file: null
    });

    useEffect(() => {
        if (college) {
            fetch(`/get-courses?college=${college}`)
                .then(res => res.json())
                .then(data => {
                    const uniqueCourses = Array.from(new Map(data.map(course => [course.Course, course])).values());
                    setCourses(uniqueCourses);
                    setData('course', ""); // Reset course selection when college changes
                })
                .catch(error => {
                    console.error("Error fetching courses:", error);
                });
        } else {
            setCourses([]);
            setData('course', "");
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
        setData('file', selectedFile);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        post("/upload-students", {
            forceFormData: true,
            onSuccess: () => {
                reset(); // Clears the form
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Management" />

            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Student Uploading</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* College Dropdown */}
                    <div>
                        <label className="block font-medium">College</label>
                        <select
                            value={data.college}
                            onChange={(e) => {
                                setCollege(e.target.value);
                                setData('college', e.target.value);
                            }}
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
                            value={data.course}
                            onChange={(e) => setData('course', e.target.value)}
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
                            value={data.schoolYear}
                            onChange={(e) => setData('schoolYear', e.target.value)}
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
                            value={data.semester}
                            onChange={(e) => setData('semester', e.target.value)}
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
                {data.file && (
                    <div className="mt-4 p-3 bg-gray-100 border rounded">
                        <p className="font-medium">Selected File:</p>
                        <p className="text-gray-700">{data.file.name}</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}