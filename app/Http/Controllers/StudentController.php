<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\OjtHours;
use App\Models\Company;
use App\Models\Student;
use App\Models\StudentCompany;
use App\Models\StudentDetails;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StudentImport;
use App\Exports\StudentsExport;
use Inertia\Inertia;
use Inertia\Response;
use PDF;

class StudentController extends Controller {

    public function index(): Response
    {
        $students = Student::select(
            'tbl_student.id',
            'tbl_student.Student_Num',
            'tbl_student.Fname',
            'tbl_student.Lname',
            'tbl_student.Year',
            'tbl_course.College as College_Name',
            'tbl_course.Course as Course_Name',
            'tbl_ojt_hrs.Hrs as Ojt_Hours',
            'tbl_ojt_hrs.Sem as Semester',
            // 'tbl_ojt_hrs.Year as School_Year' // Comment this out if not needed
        )
        ->leftJoin('tbl_course', 'tbl_student.Course_ID', '=', 'tbl_course.id')
        ->leftJoin('tbl_ojt_hrs', 'tbl_student.Course_ID', '=', 'tbl_ojt_hrs.Course_ID')
        ->get();

        $courses = Course::select('id', 'College', 'Course')->get();
        $colleges = ['CECS', 'CAS', 'CBA', 'CE', 'CON'];


        return Inertia::render('Student/Student', [
            'students' => $students,
            'courses' => $courses,
            'colleges' => $colleges,
            // 'company_list' => $company_list,
        ]);
    }

    // Show create student form
    public function create()
        {
            $colleges = ['CECS', 'CAS', 'CBA', 'CE', 'CON']; // College Enum
            return inertia('Students/CreateStudent', [
                'colleges' => $colleges
            ]);
        }

        // Store a new student
        public function store(Request $request)
        {
        // Define allowed colleges
        $allowedColleges = ['CECS', 'CAS', 'CBA', 'CE', 'CON'];

        $validated = $request->validate([
            'College' => ['required', function ($attribute, $value, $fail) use ($allowedColleges) {
                if (!in_array($value, $allowedColleges)) {
                    $fail("The selected college does not exist.");
                }
            }],
            'Course' => ['required', function ($attribute, $value, $fail) use ($request) {
                $exists = Course::where('College', $request->College)
                    ->where('Course', $value)
                    ->exists();
                if (!$exists) {
                    $fail("The course '$value' does not exist for the selected college.");
                }
            }],
            'Fname' => 'required|string|max:255',
            'Lname' => 'required|string|max:255',
            'Student_Num' => 'required|string|max:20|unique:tbl_student,Student_Num',
            'Year' => ['nullable', function ($attribute, $value, $fail) {
                if ($value && !in_array($value, ['2024-2025', '2025-2026'])) {
                    $fail('The school year must be either 2024-2025 or 2025-2026.');
                }
            }],
        ]);

        // Find Course ID for the given College & Course
        $course = Course::where('College', $validated['College'])
            ->where('Course', $validated['Course'])
            ->first();

        if (!$course) {
            return redirect()->back()->withErrors(['Course' => 'The selected course does not exist.']);
        }

        // Store Student with the correct Course_ID
        Student::create([
            'Course_ID' => $course->id,
            'Fname' => $validated['Fname'],
            'Lname' => $validated['Lname'],
            'Student_Num' => $validated['Student_Num'],
            'Year' => $request->Year ?? '2024-2025', // Default value if not provided
        ]);

        return redirect()->route('student')->with('success', 'Student added successfully!');
    }

    public function show($id)
    {
        $student = Student::select(
                'tbl_student.id',
                'tbl_student.Student_Num',
                'tbl_student.Fname',
                'tbl_student.Lname',
                'tbl_student.Year',
                'tbl_course.College as College_Name',
                'tbl_course.Course as Course_Name',
                'tbl_ojt_hrs.Hrs as Ojt_Hours',
                'tbl_ojt_hrs.Sem as Semester'
            )
            ->leftJoin('tbl_course', 'tbl_student.Course_ID', '=', 'tbl_course.id')
            ->leftJoin('tbl_ojt_hrs', 'tbl_student.Course_ID', '=', 'tbl_ojt_hrs.Course_ID')
            ->where('tbl_student.id', $id)
            ->firstOrFail();

            $company_list = Company::all();
            // $details_list = OjtHours::all();
            $student_company = StudentCompany::where('Student_ID', $id)
        ->with('company') // Load related company details
        ->get();

        return Inertia::render('Student/StudentDetails', [
            'student' => $student,
            'company_list' => $company_list,
            'student_company' => $student_company,
            // 'details_list' => $details_list,
        ]);
    }

    // Update student details
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'College' => 'required',
            'Course' => 'required',
            'Fname' => 'required|string|max:255',
            'Lname' => 'required|string|max:255',
            'Student_Num' => 'required|string|max:20|unique:tbl_student,Student_Num,' . $id,
            'Year' => ['nullable', function ($attribute, $value, $fail) {
                if ($value && !in_array($value, ['2024-2025', '2025-2026'])) {
                    $fail('The school year must be either 2024-2025 or 2025-2026.');
                }
            }],
        ]);

        // Find the appropriate course based on College and Course name
        $course = Course::where('College', $validated['College'])
            ->where('Course', $validated['Course'])
            ->first();

        if (!$course) {
            return redirect()->back()->withErrors(['Course' => 'Invalid course selection.']);
        }

        $student->update([
            'Course_ID' => $course->id,
            'Fname' => $validated['Fname'],
            'Lname' => $validated['Lname'],
            'Student_Num' => $validated['Student_Num'],
            'Year' => $validated['Year'] ?? $student->Year, // Move this here after validation
        ]);

        return redirect()->route('student')->with('success', 'Student updated successfully!');
    }

    // Delete a student
    public function destroy($id)
    {
        try {
            $student = Student::findOrFail($id);
            $student->delete();
            return response()->json(['message' => 'Student deleted successfully'], 200); // return a success response
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting student'], 400); // return error response
        }
    }

    public function uploadStudents(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
            'college' => 'required',
            'course' => 'required',
            'schoolYear' => 'required',
            'semester' => 'required'
        ]);

        $file = $request->file('file');
        $data = Excel::toArray([], $file)[0]; // Convert Excel data to an array

        $ojtHours = OjtHours::where('college', $request->college)
            ->where('course', $request->course)
            ->value('Hrs'); // Fetch OJT hours

        foreach ($data as $index => $row) {
            if ($index === 0) continue; // Skip header row

            Student::create([
                'student_number' => $row[0], // Assuming 1st column is Student ID
                'name' => $row[1] . ', ' . $row[2], // Assuming 2nd is First Name, 3rd is Last Name
                'college' => $request->college,
                'course' => $request->course,
                'school_year' => $request->schoolYear,
                'semester' => $request->semester,
                'ojt_hours' => $ojtHours
            ]);
        }

        return response()->json(['message' => 'Students uploaded successfully']);
    }

    public function batchDelete(Request $request)
    {
        $studentIds = $request->input('studentIds', []);

        if (empty($studentIds)) {
            return response()->json([
                'success' => false,
                'message' => 'No students selected for deletion'
            ]);
        }

        // Check for active transactions in tbl_student_comp
        $studentsWithTransactions = StudentCompany::whereIn('Student_ID', $studentIds)
            ->where('Status', 'On going')
            ->pluck('Student_ID')
            ->toArray();

        if (!empty($studentsWithTransactions)) {
            // Get student numbers for the restricted students
            $restrictedStudents = Student::whereIn('id', $studentsWithTransactions)
                ->pluck('Student_Num')
                ->toArray();

            return response()->json([
                'success' => false,
                'message' => 'Cannot delete students with active transactions: ' . implode(', ', $restrictedStudents)
            ]);
        }

        // Proceed with deletion for students without active transactions
        try {
            Student::whereIn('id', $studentIds)->delete();

            return response()->json([
                'success' => true,
                'message' => count($studentIds) . ' student(s) deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting students: ' . $e->getMessage()
            ], 500);
        }
    }

    public function export(Request $request)
{
    $college = $request->input('college');
    $course = $request->input('course');
    $year = $request->input('year');

    $query = Student::select(
        'tbl_student.id',
        'tbl_student.Student_Num',
        'tbl_student.Fname',
        'tbl_student.Lname',
        'tbl_student.Year',
        'tbl_course.College as College_Name',
        'tbl_course.Course as Course_Name',
        'tbl_ojt_hrs.Hrs as Ojt_Hours',
        'tbl_ojt_hrs.Sem as Semester'
    )
    ->leftJoin('tbl_course', 'tbl_student.Course_ID', '=', 'tbl_course.id')
    ->leftJoin('tbl_ojt_hrs', 'tbl_student.Course_ID', '=', 'tbl_ojt_hrs.Course_ID');

    if ($college) {
        $query->where('tbl_course.College', $college);
    }

    if ($course) {
        $query->where('tbl_course.Course', $course);
    }

    if ($year) {
        $query->where('tbl_student.Year', $year);
    }

    $students = $query->get();

    $filename = 'students';
    if ($college) $filename .= '_' . $college;
    if ($course) $filename .= '_' . $course;
    if ($year) $filename .= '_' . $year;
    $filename .= '.xlsx';

    return Excel::download(new StudentsExport($students), $filename);
}
}
