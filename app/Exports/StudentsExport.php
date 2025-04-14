<?php
namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $students;

    public function __construct(Collection $students)
    {
        $this->students = $students;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->students;
    }

    /**
     * @var Student $student
     */
    public function map($student): array
    {
        return [
            $student->Student_Num,
            $student->Fname,
            $student->Lname,
            $student->College_Name,
            $student->Course_Name,
            $student->Ojt_Hours,
            $student->Semester,
            $student->Year ?? $student->School_Year,
            $student->City,
            $student->Province
        ];
    }

    public function headings(): array
    {
        return [
            'Student Number',
            'First Name',
            'Last Name',
            'College',
            'Course',
            'OJT Hours',
            'Semester',
            'Year',
            'City',
            'Province'
        ];
    }
}