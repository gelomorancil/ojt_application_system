import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";

export default function StudentUploading({ colleges }) {
  const [isLoading, setIsLoading] = useState(false);
  
  // useForm hook
  const { data, setData, post, reset, errors, processing } = useForm({
    college: "",
    course: "",
    schoolYear: "",
    semester: "",
    file: null
  });

  // State for dependent dropdowns
  const [courses, setCourses] = useState([]);
  const [availableSchoolYears, setAvailableSchoolYears] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  
  // State for tracking if data exists
  const [coursesFetched, setCoursesFetched] = useState(false);
  const [semestersFetched, setSemestersFetched] = useState(false);

  // Generate school years (current year ± 1)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Create school year format (e.g., "2024-2025")
    for (let i = -1; i <= 1; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    
    setAvailableSchoolYears(years);
  }, []);

  // Fetch courses when college changes
  useEffect(() => {
    if (data.college) {
      setIsLoading(true);
      setCoursesFetched(false);
      
      fetch(`/api/get-courses?college=${encodeURIComponent(data.college)}`)
        .then(res => res.json())
        .then(data => {
          // Remove duplicate courses by using a Set
          const uniqueCourses = Array.from(
            new Set(data.map(c => c.Course))
          ).map(courseName => {
            // Find the first occurrence of this course name
            return data.find(c => c.Course === courseName);
          });
          
          setCourses(uniqueCourses);
          setCoursesFetched(true);
          
          // Reset dependent fields
          setData(prev => ({
            ...prev,
            course: "",
            schoolYear: "",
            semester: ""
          }));
          
          setSemestersFetched(false);
          setAvailableSemesters([]);
        })
        .catch(error => {
          console.error("Error fetching courses:", error);
          setCoursesFetched(true);
          setCourses([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setCourses([]);
      setCoursesFetched(false);
      setData(prev => ({
        ...prev,
        course: "",
        schoolYear: "",
        semester: ""
      }));
      setSemestersFetched(false);
      setAvailableSemesters([]);
    }
  }, [data.college]);

  // Fetch semesters when course and school year change
useEffect(() => {
    if (data.college && data.course && data.schoolYear) {
      setIsLoading(true);
      setSemestersFetched(false);
      
      fetch(`/api/get-semesters?college=${encodeURIComponent(data.college)}&course=${encodeURIComponent(data.course)}&schoolYear=${encodeURIComponent(data.schoolYear)}`)
        .then(res => res.json())
        .then(semestersData => {
          setAvailableSemesters(semestersData);
          setSemestersFetched(true);
          
          // Reset semester selection
          setData(prev => ({
            ...prev,
            semester: ""
          }));
        })
        .catch(error => {
          console.error("Error fetching semesters:", error);
          setSemestersFetched(true);
          setAvailableSemesters([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (data.college && data.course) {
      setAvailableSemesters([]);
      setSemestersFetched(false);
      setData(prev => ({
        ...prev,
        semester: ""
      }));
    }
  }, [data.college, data.course, data.schoolYear]);

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
        // Reset other states
        setCourses([]);
        setCoursesFetched(false);
        setAvailableSemesters([]);
        setSemestersFetched(false);
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Student Uploading" />
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Student Uploading</h2>
        
        {isLoading && (
          <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded text-center">
            Loading data...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              {colleges.map((col) => (
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
          
          {/* School Year Dropdown - Static with current year ±1 */}
          <div>
            <label className="block font-medium">School Year</label>
            <select
              value={data.schoolYear}
              onChange={(e) => setData('schoolYear', e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!data.course || isLoading}
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
          
          {/* Semester Dropdown */}
          <div>
            <label className="block font-medium">Semester</label>
            <select
              value={data.semester}
              onChange={(e) => setData('semester', e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!data.schoolYear || isLoading}
            >
              <option value="">Select semester</option>
              {availableSemesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
            {semestersFetched && availableSemesters.length === 0 && data.schoolYear && !isLoading && (
              <p className="text-sm text-orange-500 mt-1">No semesters registered for this course and school year</p>
            )}
            {errors.semester && <p className="text-sm text-red-500 mt-1">{errors.semester}</p>}
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
              disabled={!data.semester}
            />
            {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            disabled={isLoading || processing || !data.semester || !data.file}
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
      </div>
    </AuthenticatedLayout>
  );
}