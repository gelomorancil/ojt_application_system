<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StudentsImport;
use App\Models\Course;
use App\Models\Student;
use App\Models\OjtHours;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentUploadingController extends Controller
{
    public function index()
    {
    return Inertia::render('StudentUploading/StudentUploading');
    }

    public function upload(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'college' => 'required|string',
            'course' => 'required|string',
            'schoolYear' => 'required|string',
            'semester' => 'required|string',
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

            // Begin a database transaction
            DB::beginTransaction();

            // Find the course to get OJT hours
            $courseDetails = Course::where('Course', $validated['course'])->first();

            if (!$courseDetails) {
                throw new \Exception('Course not found');
            }

            // Import students
            $import = new StudentsImport(
                $validated['college'],
                $validated['course'],
                $validated['schoolYear'],
                $validated['semester']
            );
            //dd($request->file('file'));
            Excel::import($import, $request->file('file'));

            // Get imported students to create OJT hours
            $importedStudents = Student::where('college', $validated['college'])
                ->where('course', $validated['course'])
                ->where('school_year', $validated['schoolYear'])
                ->where('semester', $validated['semester'])
                ->get();

            // Create OJT Hours entries
            $ojtHoursToInsert = $importedStudents->map(function($student) use ($courseDetails) {
                return [
                    'id_number' => $student->id_number,
                    'course' => $student->course,
                    'total_hours' => $courseDetails->ojt_hours,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            })->toArray();

            // Insert OJT Hours
            OjtHours::insert($ojtHoursToInsert);

            // Commit the transaction
            DB::commit();

            // Redirect back with success message
            return redirect()->back()->with('success', 'Students uploaded successfully');

    }
}