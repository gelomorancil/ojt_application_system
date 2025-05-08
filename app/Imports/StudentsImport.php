<?php
namespace App\Imports;

use App\Models\Student;
use App\Models\Course;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\BeforeSheet;
use Maatwebsite\Excel\Events\AfterSheet;

class StudentsImport implements ToModel, WithHeadingRow, SkipsOnFailure, WithEvents
{
    use SkipsFailures;
    
    private $collegeId;
    private $courseId;
    private $schoolYear;
    private $semester;
    private $courseName;
    private $duplicateStudents = []; // Array to track duplicate student numbers
    
    public function __construct($college, $course, $schoolYear, $semester)
    {
        // Find the Course_ID based on the course name
        $courseDetails = DB::table('tbl_course')
            ->where('Course', $course)
            ->where('College', $college)
            ->first();
        
        if (!$courseDetails) {
            throw new \Exception("Course not found: $course in $college");
        }
        
        $this->collegeId = $courseDetails->College;
        $this->courseId = $courseDetails->id;
        $this->courseName = $course;
        $this->schoolYear = $schoolYear;
        $this->semester = $semester;

        // Check if OJT hours exist for this course and semester
        $ojtHours = DB::table('tbl_ojt_hrs')
            ->where('Course_ID', $this->courseId)
            ->where('Sem', $this->semester)
            ->first();

        if (!$ojtHours) {
            throw new \Exception("No OJT hours are registered for '{$this->courseName}' for '{$this->semester}' semester. Please register this course with OJT hours first.");
        }

        Log::info('StudentsImport Initialized', [
            'college' => $this->collegeId,
            'course_id' => $this->courseId,
            'course_name' => $this->courseName,
            'school_year' => $this->schoolYear,
            'semester' => $this->semester,
            'ojt_hours' => $ojtHours->Hrs ?? 'Not found'
        ]);
    }
    
    /**
     * Get the list of duplicate student numbers found during import
     */
    public function getDuplicateStudents()
    {
        return $this->duplicateStudents;
    }
    
    /**
     * Configure the heading row
     */
    public function headingRow(): int
    {
        return 1;
    }
    
    /**
     * Register events to track import process
     */
    public function registerEvents(): array
    {
        return [
            BeforeSheet::class => function(BeforeSheet $event) {
                Log::info('Starting to process Excel sheet', [
                    'sheet_name' => $event->getSheet()->getTitle()
                ]);
                
                // Log column headers
                $worksheet = $event->getSheet()->getDelegate();
                $highestColumn = $worksheet->getHighestColumn();
                
                $headerRow = [];
                $row = 1; // Assuming header is row 1
                for ($col = 'A'; $col <= $highestColumn; $col++) {
                    $cellValue = $worksheet->getCell($col . $row)->getValue();
                    $headerRow[$col] = $cellValue;
                }
                
                Log::info("Headers found in Excel", $headerRow);
            },
            AfterSheet::class => function(AfterSheet $event) {
                Log::info('Finished processing Excel sheet');
                
                if (count($this->duplicateStudents) > 0) {
                    Log::warning('Duplicate student numbers found', [
                        'count' => count($this->duplicateStudents),
                        'student_numbers' => $this->duplicateStudents
                    ]);
                }
            },
        ];
    }
    
    public function model(array $row)
    {
        // Log the original row data at the start
        Log::info('Processing row data', $row);
        
        // Convert all keys to lowercase for consistent access
        $lowercaseRow = array_change_key_case($row, CASE_LOWER);
        
        // Extract student information from Excel
        // Map to table column names based on the tbl_student structure
        $firstName = $lowercaseRow['fname'] ?? $lowercaseRow['first_name'] ?? $lowercaseRow['firstname'] ?? null;
        $lastName = $lowercaseRow['lname'] ?? $lowercaseRow['last_name'] ?? $lowercaseRow['lastname'] ?? null;
        $studentNum = $lowercaseRow['student_num'] ?? $lowercaseRow['studentnum'] ?? $lowercaseRow['student_number'] ?? null;

        Log::info('Extracted student data', [
            'fname' => $firstName, 
            'lname' => $lastName,
            'student_num' => $studentNum,
        ]);
        
        // Check if required fields are present
        if (!$studentNum || !$firstName || !$lastName) {
            Log::warning('Row skipped due to missing required fields', [
                'row_data' => $lowercaseRow
            ]);
            return null;
        }
        
        // Check if student number already exists in the database
        $existingStudent = DB::table('tbl_student')
            ->where('Student_Num', $studentNum)
            ->first();
            
        if ($existingStudent) {
            // Add to duplicate students list
            $this->duplicateStudents[] = [
                'student_num' => $studentNum,
                'name' => "$firstName $lastName"
            ];
            
            Log::warning('Duplicate student number found', [
                'student_num' => $studentNum,
                'name' => "$firstName $lastName"
            ]);
            
            return null;
        }
        
        try {
            // Create a normalized row with column names matching tbl_student
            $normalizedRow = [
                'fname' => $firstName,
                'lname' => $lastName,
                'student_num' => $studentNum,
            ];
            
            // Insert the student data using the insert method
            $studentId = $this->insert($normalizedRow);
            
            Log::info('Student successfully inserted', [
                'student_id' => $studentId,
                'student_num' => $studentNum,
                'full_name' => $firstName . ' ' . $lastName
            ]);
            
            return null;
        } catch (\Exception $e) {
            Log::error('Failed to insert student', [
                'error' => $e->getMessage(),
                'row_data' => $lowercaseRow
            ]);
            return null;
        }
    }
    
    public function insert(array $row)
    {
        // Get the OJT hours info to validate the semester exists for this course
        $ojtInfo = DB::table('tbl_ojt_hrs')
            ->where('Course_ID', $this->courseId)
            ->where('Sem', $this->semester)
            ->first();

        // If no OJT hours are found, throw an exception
        if (!$ojtInfo) {
            throw new \Exception("No OJT hours are registered for '{$this->courseName}' for '{$this->semester}' semester. Please register this course with OJT hours first.");
        }

        // Prepare student data for insertion
        $studentData = [
            'Fname' => $row['fname'],
            'Lname' => $row['lname'],
            'Student_Num' => $row['student_num'],
            'Course_ID' => $this->courseId,
            'Year' => $this->schoolYear, // Only store school year in tbl_student
            'Remarks' => '',
            'Read' => null,
            'created_at' => now(),
            'updated_at' => now()
        ];
        
        try {
            // Insert the record into tbl_student
            $studentId = DB::table('tbl_student')->insertGetId($studentData);
            return $studentId;
        } catch (\Exception $e) {
            Log::error('Insert failed: ', [$e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * Handle validation failures
     */
    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            Log::error('Excel Import Failure', [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors()
            ]);
        }
    }
}