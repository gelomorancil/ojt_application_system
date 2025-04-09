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
     * Get courses based on college
     */
    public function getCourses(Request $request): JsonResponse
    {
        $college = $request->query('college');
        
        if (!$college) {
            return response()->json([], 400);
        }
        
        $courses = DB::table('tbl_course')
            ->where('College', $college)
            ->select('id', 'Course')
            ->distinct()
            ->get();
            
        return response()->json($courses);
    }
    
    /**
     * Get semesters based on college and course
     * This will now get only semesters that have OJT hours registered for the selected course
     */
    public function getSemesters(Request $request): JsonResponse
    {
        $college = $request->query('college');
        $course = $request->query('course');
        
        if (!$college || !$course) {
            return response()->json([], 400);
        }
        
        // Get the course ID first
        $courseId = DB::table('tbl_course')
            ->where('College', $college)
            ->where('Course', $course)
            ->value('id');
            
        if (!$courseId) {
            return response()->json([], 404);
        }
        
        // Get semesters that are registered for this specific course
        $semesters = DB::table('tbl_ojt_hrs')
            ->where('Course_ID', $courseId)
            ->select('Sem')
            ->distinct()
            ->orderBy('Sem')
            ->pluck('Sem')
            ->toArray();
        
        // Return only the semesters found in the database for this course
        return response()->json($semesters);
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
}