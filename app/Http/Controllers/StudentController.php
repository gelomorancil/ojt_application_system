<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller {
    
    public function index(): Response
    {
        $students = Student::select('tbl_student.*')
            ->leftJoin('tbl_course', 'tbl_student.Course_ID', '=', 'tbl_course.id')
            ->select(
                'tbl_student.id',
                'tbl_student.Student_Num',
                'tbl_student.Fname',
                'tbl_student.Lname',
                'tbl_course.College as College_Name',
                'tbl_course.Course as Course_Name'
            )
            ->get();

        $courses = Course::select('id', 'College', 'Course')->get();
        $colleges = ['CECS', 'CAS', 'CBA', 'CE', 'CON'];

        return Inertia::render('Student/Student', [
            'students' => $students,
            'courses' => $courses,
            'colleges' => $colleges
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
        ]);

        return redirect()->route('student')->with('success', 'Student added successfully!');
    }

    // Show a single student (if needed)
    public function show($id): Response
    {
        $student = Student::findOrFail($id);
        return Inertia::render('StudentDetail', ['student' => $student]);
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
}
