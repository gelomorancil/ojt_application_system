<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    // Display all students
    public function index(): Response
    {
        $students = Student::all();
        return Inertia::render('Student/Student', ['students' => $students]);
    }

    public function create(): Response
    {
        return Inertia::render('Student/Partials/Create_Student');
    }

    // Store a new student
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Course_ID' => 'required|string|max:10',
            'Fname' => 'required|string|max:255',
            'Lname' => 'required|string|max:255',
            'Student_Num' => 'required|string|max:20|unique:tbl_student,Student_Num',
        ]);

        Student::create($validated);
        return redirect()->route('student')->with('success', 'Student added successfully!');
    }

    // Show a single student (if needed)
    public function show($id): Response
    {
        $student = Student::findOrFail($id);
        return Inertia::render('StudentDetail', ['student' => $student]);
    }

    // Edit student details (fetch and pass data to Edit_Student.jsx)
    public function edit($id): Response
    {
        $student = Student::findOrFail($id); // Fetch student by ID
        return Inertia::render('Student/Partials/Edit_Student', [
            'student' => $student, // Pass student data to Inertia component
        ]);
    }

    // Update student details
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'Course_ID' => 'required|max:10',
            'Fname' => 'required|string|max:255',
            'Lname' => 'required|string|max:255',
            'Student_Num' => 'required|string|max:20|unique:tbl_student,Student_Num,' . $id,
        ]);

        $student->update($validated);
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
