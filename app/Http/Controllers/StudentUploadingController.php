<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StudentsImport;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentUploadingController extends Controller
{
    /**
     * Display the student uploading form
     */
    public function index()
    {
        // Get distinct colleges from tbl_course
        $colleges = DB::table('tbl_course')
            ->select('College')
            ->distinct()
            ->pluck('College');

        return Inertia::render('StudentUploading/StudentUploading', [
            'colleges' => $colleges,
        ]);
    }

    /**
     * Upload students from Excel file
     */
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'college' => 'required|string',
            'course' => 'required|string',
            'schoolYear' => 'required|string',
            'semester' => 'required|string',
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        DB::beginTransaction();
        try {
            Log::info('Starting student upload process', [
                'college' => $validated['college'],
                'course' => $validated['course'],
                'schoolYear' => $validated['schoolYear'],
                'semester' => $validated['semester']
            ]);

            // Fetch course details
            $courseDetails = DB::table('tbl_course')
                ->where('College', $validated['college'])
                ->where('Course', $validated['course'])
                ->first();

            if (!$courseDetails) {
                throw new \Exception("Course not found: {$validated['course']} in {$validated['college']}");
            }

            // Check if OJT hours exist for this course and semester
            $ojtHours = DB::table('tbl_ojt_hrs')
                ->where('Course_ID', $courseDetails->id)
                ->where('Sem', $validated['semester'])
                ->first();

            // If no OJT hours are found, throw an exception
            if (!$ojtHours) {
                throw new \Exception("No OJT hours are registered for this course and semester. Please register OJT hours first.");
            }

            // Create StudentsImport instance
            $import = new StudentsImport(
                $validated['college'],
                $validated['course'],
                $validated['schoolYear'],
                $validated['semester']
            );

            // Import students
            Excel::import($import, $request->file('file'));

            // Get duplicate students after import
            $duplicateStudents = $import->getDuplicateStudents();

            DB::commit();

            if (count($duplicateStudents) > 0) {
                return redirect()->back()->with([
                    'success' => 'Students uploaded successfully with some duplicates skipped',
                    'duplicateStudents' => $duplicateStudents
                ]);
            }

            return redirect()->back()->with('success', 'Students uploaded successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Student upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Upload failed: ' . $e->getMessage());
        }
    }

    public function getCourses(Request $request)
    {
        $college = $request->input('college');
        
        // Get all colleges again to ensure they're available
        $colleges = DB::table('tbl_course')
            ->select('College')
            ->distinct()
            ->pluck('College');
        
        $courses = Course::where('College', $college)->get();
        
        // Return ALL needed data in the response
        return Inertia::render('StudentUploading/StudentUploading', [
            'colleges' => $colleges,
            'courses' => $courses
        ]);
    }

    public function getSemesters(Request $request)
    {
        $college = $request->input('college');
        $course = $request->input('course');
        
        // Get all colleges again
        $colleges = DB::table('tbl_course')
            ->select('College')
            ->distinct()
            ->pluck('College');
        
        // Get courses for this college
        $courses = Course::where('College', $college)->get();
        
        $semesters = DB::table('tbl_ojt_hrs')
                        ->join('tbl_course', function($join) use ($college, $course) {
                            $join->on('tbl_ojt_hrs.Course_ID', '=', 'tbl_course.id')
                                ->where('tbl_course.College', '=', $college)
                                ->where('tbl_course.Course', '=', $course);
                        })
                        ->pluck('tbl_ojt_hrs.Sem')
                        ->unique()
                        ->values()
                        ->toArray();
        
        // Return ALL needed data
        return Inertia::render('StudentUploading/StudentUploading', [
            'colleges' => $colleges,
            'courses' => $courses,
            'semesters' => $semesters
        ]);
    }
}