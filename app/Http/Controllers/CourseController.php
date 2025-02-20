<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\OjtHours;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    // Display all courses
    public function index()
    {
        $courses = Course::with('ojtHours')->get();
        return Inertia::render('Courses/Index', ['courses' => $courses]);
    }

    // Show the create course form
    public function create()
    {
        return Inertia::render('Courses/Create');
    }

    // Store a new course along with OJT Hours
    public function store(Request $request)
    {
        \Log::info('Request Data:', $request->all()); 

        $validatedData = $request->validate([
            'College' => 'required|string|max:255',
            'Course' => 'required|string|max:255',
            'Hrs' => 'required|integer|min:0',
            'Sem' => 'required|string|max:50',
            'Year' => 'required|string|max:9', // Format: YYYY-YYYY
        ]);

        // Create Course
        $course = Course::create([
            'College' => $validatedData['College'],
            'Course' => $validatedData['Course'],
        ]);

        // Store OJT Hours linked to Course
        OjtHours::create([
            'Course_ID' => $course->id, // Link to newly created course
            'Hrs' => $validatedData['Hrs'],
            'Sem' => $validatedData['Sem'],
            'Year' => $validatedData['Year'],
        ]);

        return redirect()->route('course.index')->with('success', 'Course created successfully with OJT details!');
    }

    // Show the edit form for a course
    public function edit($id) {
        $course = Course::with('ojtHours')->findOrFail($id);
        return Inertia::render('Courses/Edit', ['course' => $course]);
    }

    // Update course details along with OJT Hours
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'College' => 'required|string|max:255',
                'Course' => 'required|string|max:255',
                'Hrs' => 'required|integer|min:0',
                'Sem' => 'required|string|max:50',
                'Year' => 'required|string|max:9',
            ]);

            $course = Course::findOrFail($id);
            $course->update([
                'College' => $validatedData['College'],
                'Course' => $validatedData['Course'],
            ]);

            OjtHours::updateOrCreate(
                ['Course_ID' => $course->id],
                [
                    'Hrs' => $validatedData['Hrs'],
                    'Sem' => $validatedData['Sem'],
                    'Year' => $validatedData['Year'],
                ]
            );

            return redirect()->route('course.index')->with('success', 'Course updated successfully!');
        } catch (\Exception $e) {
            \Log::error("Course Update Failed: " . $e->getMessage());
            return redirect()->route('course.index')->with('error', 'Failed to update course. Please try again.');
        }
    }

    // Delete a course and its associated OJT Hours
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->ojtHours()->delete(); // Delete linked OJT Hours first
        $course->delete(); // Delete Course

        return redirect()->route('course.index')->with('success', 'Course and OJT details deleted successfully!');
    }
}
