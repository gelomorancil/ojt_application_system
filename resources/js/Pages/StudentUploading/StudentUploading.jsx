import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";

export default function StudentUploading({ colleges, flash }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [duplicateStudents, setDuplicateStudents] = useState([]);
  
  // useForm hook
  const { data, setData, post, reset, errors, processing } = useForm({
    college: "",
    course: "",
    semester: "",
    schoolYear: "",
    file: null
  });

  // State for dependent dropdowns
  const [courses, setCourses] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableSchoolYears, setAvailableSchoolYears] = useState([]);
  
  // State for tracking if data exists
  const [coursesFetched, setCoursesFetched] = useState(false);
  const [semestersFetched, setSemestersFetched] = useState(false);

  // Check flash messages when component mounts or updates
  useEffect(() => {
    // Check if there are any duplicate students in the flash message
    if (flash && flash.duplicateStudents) {
      setDuplicateStudents(flash.duplicateStudents);
      setShowDuplicates(true);
    }
  }, [flash]);

  // Generate default school years (current year ± 1)
  const defaultSchoolYears = (() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Create school year format (e.g., "2024-2025")
    for (let i = -1; i <= 1; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    
    return years;
  })();

  useEffect(() => {
    // Set default school years when component loads
    setAvailableSchoolYears(defaultSchoolYears);
  }, []);

  // Fetch courses when college changes
  useEffect(() => {
    if (data.college) {
      setIsLoading(true);
      setCoursesFetched(false);
      
      router.visit(`/get-courses`, {
        method: 'get',
        data: { college: data.college }, 
        preserveState: true,
        onSuccess: (page) => {
          // Check if courses exist in the response
          if (page.props && page.props.courses) {
            const coursesData = page.props.courses || [];
            const uniqueCourses = Array.from(
              new Set(coursesData.map(c => c.Course))
            ).map(courseName => {
              return coursesData.find(c => c.Course === courseName);
            });
            
            setCourses(uniqueCourses);
          } else {
            console.error("No courses data received from server");
            setCourses([]);
          }
          
          setCoursesFetched(true);
          
          // Reset course selection
          setData(prev => ({
            ...prev,
            course: "",
            semester: "",
            schoolYear: ""
          }));
          
          // Clear semesters when course changes
          setAvailableSemesters([]);
          setSemestersFetched(false);
        },
        onError: (error) => {
          console.error("Error fetching courses:", error);
          setCoursesFetched(true);
          setCourses([]);
        },
        onFinish: () => {
          setIsLoading(false);
        }
      });
    } else {
      setCourses([]);
      setCoursesFetched(false);
      setData(prev => ({
        ...prev,
        course: "",
        semester: "",
        schoolYear: ""
      }));
      setAvailableSemesters([]);
      setSemestersFetched(false);
    }
  }, [data.college]);
  
  // Fetch available semesters for the selected course
  useEffect(() => {
    if (data.college && data.course) {
      setIsLoading(true);
      setSemestersFetched(false);
      
      // Using Inertia's router.visit instead of fetch API
      router.visit(`/get-semesters`, {
        method: 'get',
        data: { 
          college: data.college,
          course: data.course 
        },
        preserveState: true,
        only: ['semesters'],
        onSuccess: (page) => {
          const semestersData = page.props.semesters || [];
          setAvailableSemesters(semestersData);
          setSemestersFetched(true);
          
          // Reset semester selection
          setData(prev => ({
            ...prev,
            semester: "",
            schoolYear: ""
          }));
        },
        onError: () => {
          console.error("Error fetching semesters");
          setSemestersFetched(true);
          setAvailableSemesters([]);
        },
        onFinish: () => {
          setIsLoading(false);
        }
      });
    } else {
      setAvailableSemesters([]);
      setSemestersFetched(false);
      setData(prev => ({
        ...prev,
        semester: "",
        schoolYear: ""
      }));
    }
  }, [data.college, data.course]);

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setData('file', selectedFile);
  };

  // Show confirmation dialog
  const handleShowConfirmation = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };
  
  // Handle form submission after confirmation
  const handleSubmit = () => {
    setShowConfirmation(false);
    post("/upload-students", {
      forceFormData: true,
      onSuccess: () => {
        reset(); // Clears the form
        // Reset other states
        setCourses([]);
        setCoursesFetched(false);
        setAvailableSemesters([]);
        setSemestersFetched(false);
      }
    });
  };
  
  // Close duplicate students modal
  const handleCloseDuplicates = () => {
    setShowDuplicates(false);
    setDuplicateStudents([]);
  };
  
  // Cancel confirmation
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Student Uploading" />
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Student Uploading</h2>
        
        {/* Flash Messages */}
        {flash && flash.success && (
          <div className="mb-4 p-2 bg-green-50 text-green-700 rounded">
            {flash.success}
          </div>
        )}
        
        {flash && flash.error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 rounded">
            {flash.error}
          </div>
        )}
        
        {isLoading && (
          <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded text-center">
            Loading data...
          </div>
        )}
        
        <form onSubmit={handleShowConfirmation} className="space-y-4">
          {/* College Dropdown */}
          <div>
            <label className="block font-medium">College</label>
            <select
              value={data.college}
              onChange={(e) => setData('college', e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            >
              <option value="">Select a college</option>
              {colleges && colleges.length > 0 && colleges.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            {errors.college && <p className="text-sm text-red-500 mt-1">{errors.college}</p>}
          </div>
          
          {/* Course Dropdown */}
          <div>
            <label className="block font-medium">Course</label>
            <select
              value={data.course}
              onChange={(e) => setData('course', e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!data.college || isLoading}
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.Course}>
                  {c.Course}
                </option>
              ))}
            </select>
            {errors.course && <p className="text-sm text-red-500 mt-1">{errors.course}</p>}
            {coursesFetched && courses.length === 0 && data.college && !isLoading && (
              <p className="text-sm text-red-500 mt-1">No courses available for this college</p>
            )}
          </div>
          
          {/* Semester Dropdown - Fetched options based on course */}
          <div>
            <label className="block font-medium">Semester</label>
            <select
              value={data.semester}
              onChange={(e) => setData('semester', e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!data.course || isLoading}
            >
              <option value="">Select semester</option>
              {availableSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
            {errors.semester && <p className="text-sm text-red-500 mt-1">{errors.semester}</p>}
            {semestersFetched && availableSemesters.length === 0 && data.course && !isLoading && (
              <p className="text-sm text-red-500 mt-1">No semesters available for this course</p>
            )}
          </div>
          
          {/* School Year Dropdown */}
          <div>
            <label className="block font-medium">School Year</label>
            <select
              value={data.schoolYear}
              onChange={(e) => setData('schoolYear', e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!data.semester || isLoading}
            >
              <option value="">Select school year</option>
              {availableSchoolYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.schoolYear && <p className="text-sm text-red-500 mt-1">{errors.schoolYear}</p>}
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
              disabled={!data.schoolYear}
            />
            {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            disabled={isLoading || processing || !data.schoolYear || !data.file}
          >
            {processing ? "Uploading..." : "Upload"}
          </button>
        </form>
        
        {/* File Preview */}
        {data.file && (
          <div className="mt-4 p-3 bg-gray-100 border rounded">
            <p className="font-medium">Selected File:</p>
            <p className="text-gray-700">{data.file.name}</p>
          </div>
        )}
        
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Upload</h3>
              <p className="mb-2">Please verify the following details:</p>
              <div className="bg-gray-50 p-3 rounded mb-4">
                <p><strong>College:</strong> {data.college}</p>
                <p><strong>Course:</strong> {data.course}</p>
                <p><strong>Semester:</strong> {data.semester}</p>
                <p><strong>School Year:</strong> {data.schoolYear}</p>
                <p><strong>File:</strong> {data.file?.name}</p>
              </div>
              <p className="mb-4">Are you sure you want to proceed with the upload?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelConfirmation}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  type="button"
                >
                  Confirm Upload
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Duplicate Students Dialog */}
        {showDuplicates && duplicateStudents.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full">
              <h3 className="text-lg font-semibold mb-4">
                <span className="text-yellow-600">⚠️ Warning:</span> Duplicate Student IDs Found
              </h3>
              <p className="mb-4">
                The following {duplicateStudents.length} student ID(s) already exist in the system and were not added:
              </p>
              <div className="bg-yellow-50 p-3 rounded mb-4 max-h-60 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-yellow-200">
                      <th className="text-left p-2">Student ID</th>
                      <th className="text-left p-2">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicateStudents.map((student, index) => (
                      <tr key={index} className="border-b border-yellow-100">
                        <td className="p-2">{student.student_num}</td>
                        <td className="p-2">{student.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                These student records were skipped. All other students were uploaded successfully.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleCloseDuplicates}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  type="button"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}