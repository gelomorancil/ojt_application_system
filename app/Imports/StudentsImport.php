<?php
namespace App\Imports;

use App\Models\Student;
use App\Models\Course;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Facades\Log;

class StudentsImport implements ToModel, WithHeadingRow, WithValidation
{
    use SkipsFailures;

    private $collegeId;
    private $courseId;
    private $schoolYear;
    private $semester;

    public function __construct($college, $course, $schoolYear, $semester)
    {
        // Find the Course_ID based on the course name
        $courseDetails = Course::where('Course', $course)
            ->where('College', $college)
            ->first();

        if (!$courseDetails) {
            throw new \Exception("Course not found: $course in $college");
        }

        $this->collegeId = $courseDetails->College;
        $this->courseId = $courseDetails->id;
        $this->schoolYear = $schoolYear;
        $this->semester = $semester;

        Log::info('StudentsImport Initialized', [
            'college' => $this->collegeId,
            'course_id' => $this->courseId,
            'school_year' => $this->schoolYear,
            'semester' => $this->semester
        ]);
    }

    public function model(array $row)
    {
        // Log each row being processed
        Log::info('Processing Row', [
            'first_name' => $row['first_name'] ?? 'N/A',
            'last_name' => $row['last_name'] ?? 'N/A',
            'id_number' => $row['id_number'] ?? 'N/A'
        ]);

        // Check if required fields are present
        if (!isset($row['Fname']) || !isset($row['Lname']) || !isset($row['Student_Num'])) {
            Log::warning('Row skipped due to missing required fields', [
                'row_data' => $row
            ]);
            return null;
        }

        // Create student model with database column names
        $student = new Student([
            'Fname' => $row['Fname'],
            'Lname' => $row['Lname'],
            'Student_Num' => $row['Student_Num'],
            'Course_ID' => $this->courseId,
            'Year' => $this->schoolYear,
            // You might want to add more fields if needed
        ]);

        // Log successful student creation
        Log::info('Student Model Created', [
            'student_num' => $student->Student_Num,
            'full_name' => $student->Fname . ' ' . $student->Lname
        ]);

        return $student;
    }

    public function rules(): array
    {
        return [
            'first name' => 'required|string|max:255',
            'last name' => 'required|string|max:255',
            'id number' => 'required|string|unique:tbl_student,Student_Num',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'id number.unique' => 'Student with this ID number already exists.',
            'first name.required' => 'First name is required.',
            'last name.required' => 'Last name is required.',
        ];
    }

    public function onFailure(Failure ...$failures)
    {
        // Log or handle validation failures
        foreach ($failures as $failure) {
            Log::error('Excel Import Failure', [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values()
            ]);
        }
    }
}