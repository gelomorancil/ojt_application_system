<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\OjtHours;
use App\Models\Company;
use App\Models\Student;
use App\Models\StudentCompany;
use App\Models\StudentDetails;
use App\Models\StudentFIle;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StudentImport;
use App\Exports\StudentsExport;
use Inertia\Inertia;
use Inertia\Response;
use \Illuminate\Support\Facades\Auth;
use App\Models\User; // <-- import User model
use Illuminate\Support\Facades\Hash; // <-- import Hash
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
            'tbl_company.City',
            'tbl_company.Province'
        )
        ->leftJoin('tbl_course', 'tbl_student.Course_ID', '=', 'tbl_course.id')
        ->leftJoin('tbl_ojt_hrs', 'tbl_student.Course_ID', '=', 'tbl_ojt_hrs.Course_ID')
        ->leftJoin('tbl_student_comp', 'tbl_student.id', '=', 'tbl_student_comp.Student_ID')
        ->leftJoin('tbl_company', 'tbl_student_comp.Comp_ID', '=', 'tbl_company.id')
        ->get();

        $courses = Course::select('id', 'College', 'Course')->get();
        $colleges = ['CECS', 'CAS', 'CBA', 'CE', 'CON'];
        
        // Get all provinces and cities from the company table
        $provinces = Company::distinct('Province')->whereNotNull('Province')->pluck('Province')->toArray();

        // Organize cities by province
        $citiesByProvince = [];
        $allCities = Company::whereNotNull('Province')->whereNotNull('City')
            ->select('Province', 'City')
            ->get();

        foreach ($allCities as $record) {
            if (!isset($citiesByProvince[$record->Province])) {
                $citiesByProvince[$record->Province] = [];
            }
            if (!in_array($record->City, $citiesByProvince[$record->Province])) {
                $citiesByProvince[$record->Province][] = $record->City;
            }
        }

        return Inertia::render('Student/Student', [
            'students' => $students,
            'courses' => $courses,
            'colleges' => $colleges,
            'provinces' => $provinces,
            'citiesByProvince' => $citiesByProvince,
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
        $allowedColleges = ['CECS', 'CAS', 'CBA', 'CE', 'CON'];

        $validated = $request->validate([
            'College' => ['required', function ($attribute, $value, $fail) use ($allowedColleges) {
                if (!in_array($value, $allowedColleges)) {
                    $fail("The selected college does not exist.");
                }
            }],
            'Course' => ['required', function ($attribute, $value, $fail) use ($request) {
                $exists = \App\Models\Course::where('College', $request->College)
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
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        // Find the course
        $course = \App\Models\Course::where('College', $validated['College'])
            ->where('Course', $validated['Course'])
            ->first();

        if (!$course) {
            return redirect()->back()->withErrors(['Course' => 'The selected course does not exist.']);
        }

        // Create student with Read field set to '0000-00-00 00:00:00' to indicate unread
        $student = Student::create([
            'Course_ID' => $course->id,
            'Fname' => $validated['Fname'],
            'Lname' => $validated['Lname'],
            'Student_Num' => $validated['Student_Num'],
            'Year' => $request->Year ?? '2024-2025',
            'Remarks' => '',
            'Read' => '0000-00-00 00:00:00', 
        ]);

        // Create user linked to student
        User::create([
            'name' => $validated['Fname'] . ' ' . $validated['Lname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student', // Optional: default to 'student'
            'student_id' => $student->id,
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
                'tbl_student.Remarks',
                'tbl_student.Read as remarks_read_at',
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

    $preDeployment = StudentFile::where('Student_Num', $id)
    ->whereIn('category', [
        'RESUME',
        'ENDORSEMENT LETTER',
        'APPLICATION LETTER',
        "PARENT'S/GUARDIAN CONSENT",
        "PARENT'S/GUARDIAN ID",
        "LETTER OF INTENT",
    ])
    ->get();


    $deployment = StudentFile::where('Student_Num', $id)
    ->whereIn('category', [
        "INTERNSHIP PROGRAM COVER",
        "COMPANY PROFILE",
        "CERTIFICATE OF REGISTRATION",
        "INTERNSHIP UNDERTAKING",
        "INTERNSHIP INFORMATION SHEET",
    ])
    ->get();

    $final = StudentFile::where('Student_Num', $id)
    ->whereIn('category', [
        "DAILY TIME RECORD (DTR)",
        "ACCOMPLISHMENT REPORT",
        "STUDENT INTERNSHIP EVALUATION",
        "CERTIFICATE OF COMPLETION",
    ])
    ->get();

    $dtr = StudentFile::where('Student_Num', $id)
    ->whereIn('category', ['DTR'])
    ->orderBy('created_at', 'desc')
    ->get();

        return Inertia::render('Student/StudentDetails', [
            'student' => $student,
            'company_list' => $company_list,
            'student_company' => $student_company,
            'preDeployment' => $preDeployment,
            'deployment' => $deployment,
            'final' => $final,
            'dtr' => $dtr,
            'auth' => [
                'user' => Auth::user(),
            ],
            // 'details_list' => $details_list,
        ]);

        // Check if this is a student viewing their own page
        // This logic depends on your auth system - adjust accordingly
        if (auth()->user()->role === 'student' && auth()->user()->student_id == $id) {
            // Only update timestamp if there are remarks to read and it hasn't been read yet
            if ($student->Remarks && ($student->remarks_read_at == '0000-00-00 00:00:00' || $student->remarks_read_at === null)) {
                $student->Read = now(); // Use the existing Read column
                $student->save();
            }
        }
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
            'Year' => $validated['Year'] ?? $student->Year,
            'Read' => now(),
        ]);

        return redirect()->route('student')->with('success', 'Student updated successfully!');
    }

    // Delete a student
    public function destroy($id)
    {
        try {
            $student = Student::with('user')->findOrFail($id);
            
            // Delete associated user record first
            if ($student->user) {
                $student->user->delete();
            }
            
            // Now delete the student
            $student->delete();
            
            return response()->json(['message' => 'Student deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting student: ' . $e->getMessage()], 400);
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
            // Find the related users and delete them first
            $userIds = User::whereIn('student_id', $studentIds)->pluck('id')->toArray();
            if (!empty($userIds)) {
                User::whereIn('id', $userIds)->delete();
            }
            
            // Now delete the students
            $deletedCount = Student::whereIn('id', $studentIds)->delete();

            return response()->json([
                'success' => true,
                'message' => $deletedCount . ' student(s) deleted successfully'
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
        $province = $request->input('province');
        $city = $request->input('city');

        $query = Student::select(
            'tbl_student.id',
            'tbl_student.Student_Num',
            'tbl_student.Fname',
            'tbl_student.Lname',
            'tbl_student.Year',
            'tbl_course.College as College_Name',
            'tbl_course.Course as Course_Name',
            'tbl_ojt_hrs.Hrs as Ojt_Hours',
            'tbl_ojt_hrs.Sem as Semester',
            'tbl_company.City',
            'tbl_company.Province'
        )
        ->leftJoin('tbl_course', 'tbl_student.Course_ID', '=', 'tbl_course.id')
        ->leftJoin('tbl_ojt_hrs', 'tbl_student.Course_ID', '=', 'tbl_ojt_hrs.Course_ID')
        ->leftJoin('tbl_student_comp', 'tbl_student.id', '=', 'tbl_student_comp.Student_ID')
        ->leftJoin('tbl_company', 'tbl_student_comp.Comp_ID', '=', 'tbl_company.id');

        if ($college) {
            $query->where('tbl_course.College', $college);
        }

        if ($course) {
            $query->where('tbl_course.Course', $course);
        }

        if ($year) {
            $query->where('tbl_student.Year', $year);
        }

        if ($province) {
            $query->where('tbl_company.Province', $province);
        }

        if ($city) {
            $query->where('tbl_company.City', $city);
        }

        $students = $query->get();

        $filename = 'students';
        if ($college) $filename .= '_' . $college;
        if ($course) $filename .= '_' . $course;
        if ($year) $filename .= '_' . $year;
        if ($province) $filename .= '_' . $province;
        if ($city) $filename .= '_' . $city;
        $filename .= '.xlsx';

        return Excel::download(new StudentsExport($students), $filename);
    }

    public function updateRemarks(Request $request, $id)
    {
        $request->validate([
            'remarks' => 'nullable|string|max:2000'
        ]);
        
        $student = Student::findOrFail($id);
        
        // Only reset the Read timestamp if remarks have changed
        if ($student->Remarks !== $request->input('remarks')) {
            $student->Remarks = $request->input('remarks');
            $student->Read = null; // Use null instead of '0000-00-00 00:00:00'
            $student->save();
            
            return redirect()->back()->with('success', 'Remarks updated successfully.');
        }
        
        return redirect()->back()->with('info', 'No changes made to remarks.');
    }
}
