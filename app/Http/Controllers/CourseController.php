<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\OjtHours;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    // Display all courses
    public function index()
    {
        // Get courses with their OJT hours records
        $courses = Course::with('ojtHours')->get();
        
        // Transform the courses to a more convenient format for the front-end
        $transformedCourses = $courses->map(function($course) {
            // Structure the OJT hours for easier consumption in the frontend
            $ojtHoursData = $course->ojtHours->map(function($hour) {
                return [
                    'id' => $hour->id,
                    'Hrs' => $hour->Hrs,
                    'Sem' => $hour->Sem,
                    'Year' => $hour->Year,
                    'created_at' => $hour->created_at,
                    'updated_at' => $hour->updated_at,
                ];
            });
            
            return [
                'id' => $course->id,
                'College' => $course->College,
                'Course' => $course->Course,
                'created_at' => $course->created_at,
                'updated_at' => $course->updated_at,
                'ojt_hours' => $ojtHoursData
            ];
        });
        
        return Inertia::render('Courses/Course', ['courses' => $transformedCourses]);
    }

    // Show the create course form
    public function create()
    {
        return Inertia::render('Courses/Create');
    }

    public function store(Request $request)
    {
        Log::info('Request Data:', $request->all());
        
        // Validate request data
        $validatedData = $request->validate([
            'College' => 'required|string|max:255',
            'Course' => 'required|string|max:255',
            'Hrs' => 'required|integer|min:0',
            'Sem' => 'required|string|max:50',
            'Year' => 'required|string|max:9', // Format: YYYY-YYYY
        ]);

        // Normalize course name for comparison
        $normalizedCourseName = trim(strtolower($validatedData['Course']));
        
        // Check if the course already exists (by name only)
        $existingCourse = Course::where('Course', 'LIKE', $normalizedCourseName)->first();
        
        if ($existingCourse) {
            // Check if there's an OJT hours entry for this course with the same year
            $existingEntry = OjtHours::where('Course_ID', $existingCourse->id)
                                ->where('Year', $validatedData['Year'])
                                ->exists();
            
            if ($existingEntry) {
                return redirect()->back()->withErrors([
                    'Course' => 'This course already exists for the selected school year.'
                ])->withInput();
            }
            
            // If course exists but not for this year, add new OJT hours record
            OjtHours::create([
                'Course_ID' => $existingCourse->id,
                'Hrs' => $validatedData['Hrs'],
                'Sem' => $validatedData['Sem'],
                'Year' => $validatedData['Year'],
            ]);
            
            return redirect()->route('course.index')->with(
                'success', 'New semester/year added to existing course!'
            );
        }
        
        // If course doesn't exist, create new course and OJT hours
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
        
        return redirect()->route('course.index')->with(
            'success', 'Course created successfully with OJT details!'
        );
    }

    public function edit($id)
    {
        $course = Course::with('ojtHours')->findOrFail($id);
        $courses = Course::with('ojtHours')->get();
        
        // Transform the courses similar to the index method
        $transformedCourses = $courses->map(function($c) {
            $ojtHoursData = $c->ojtHours->map(function($hour) {
                return [
                    'id' => $hour->id,
                    'Hrs' => $hour->Hrs,
                    'Sem' => $hour->Sem,
                    'Year' => $hour->Year,
                    'created_at' => $hour->created_at,
                    'updated_at' => $hour->updated_at,
                ];
            });
            
            return [
                'id' => $c->id,
                'College' => $c->College,
                'Course' => $c->Course,
                'created_at' => $c->created_at,
                'updated_at' => $c->updated_at,
                'ojt_hours' => $ojtHoursData
            ];
        });
        
        // Transform the single course being edited
        $transformedCourse = [
            'id' => $course->id,
            'College' => $course->College,
            'Course' => $course->Course,
            'created_at' => $course->created_at,
            'updated_at' => $course->updated_at,
            'ojt_hours' => $course->ojtHours->map(function($hour) {
                return [
                    'id' => $hour->id,
                    'Hrs' => $hour->Hrs,
                    'Sem' => $hour->Sem,
                    'Year' => $hour->Year,
                    'created_at' => $hour->created_at,
                    'updated_at' => $hour->updated_at,
                ];
            })
        ];
        
        return Inertia::render('Courses/Course', [
            'course' => $transformedCourse,
            'courses' => $transformedCourses,
        ]);
    }

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
                [
                    'Course_ID' => $course->id,
                    'Year' => $validatedData['Year']
                ],
                [
                    'Hrs' => $validatedData['Hrs'],
                    'Sem' => $validatedData['Sem'],
                ]
            );

            return redirect()->route('course.index')->with('success', 'Course updated successfully!');
        } catch (\Exception $e) {
            Log::error("Course Update Failed: " . $e->getMessage());
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

    public function getCoursesByCollege(Request $request)
    {
        $courses = Course::where('College', $request->college)->get();
        return response()->json($courses);
    }
}
