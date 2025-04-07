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
     * We're no longer fetching school years from the database
     * This method is kept for backwards compatibility but could be removed
     */
    public function getSchoolYears(Request $request): JsonResponse
    {
        // Generate school years dynamically instead of fetching from DB
        $currentYear = date('Y');
        $years = [];
        
        for ($i = -1; $i <= 1; $i++) {
            $startYear = $currentYear + $i;
            $endYear = $startYear + 1;
            $years[] = "$startYear-$endYear";
        }
        
        return response()->json($years);
    }
    
    /**
 * Get semesters based on college, course, and school year
 */
public function getSemesters(Request $request): JsonResponse
{
    $college = $request->query('college');
    $course = $request->query('course');
    $schoolYear = $request->query('schoolYear');
    
    if (!$college || !$course || !$schoolYear) {
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
    
    // Only get semesters that are registered for this specific course and school year
    $semesters = DB::table('tbl_ojt_hrs')
        ->where('Course_ID', $courseId)
        ->where('Year', $schoolYear)
        ->select('Sem')
        ->distinct()
        ->orderBy('Sem')
        ->pluck('Sem')
        ->toArray();
    
    // Return only the semesters found in the database (no default values)
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

            // Check if OJT hours exist for this course, year, and semester
            $ojtHours = DB::table('tbl_ojt_hrs')
                ->where('Course_ID', $courseDetails->id)
                ->where('Year', $validated['schoolYear'])
                ->where('Sem', $validated['semester'])
                ->first();

            // If no OJT hours are found, create a record with default hours
            if (!$ojtHours) {
                // Insert default OJT hours record
                DB::table('tbl_ojt_hrs')->insert([
                    'Course_ID' => $courseDetails->id,
                    'Year' => $validated['schoolYear'],
                    'Sem' => $validated['semester'],
                    'Hrs' => 300, // Default OJT hours
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                
                Log::info('Created default OJT hours record', [
                    'course_id' => $courseDetails->id,
                    'school_year' => $validated['schoolYear'],
                    'semester' => $validated['semester'],
                    'default_hours' => 300
                ]);
            }

            // Import students
            Excel::import(new StudentsImport(
                $validated['college'],
                $validated['course'],
                $validated['schoolYear'],
                $validated['semester']
            ), $request->file('file'));

            DB::commit();
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