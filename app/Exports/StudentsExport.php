<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $students;

    public function __construct($students)
    {
        $this->students = $students;
    }

    public function collection()
    {
        return $this->students;
    }

    public function headings(): array
    {
        return [
            'Student Number',
            'Last Name',
            'First Name',
            'College',
            'Course',
            'OJT Hours',
            'Semester',
            'School Year'
        ];
    }

    public function map($student): array
    {
        return [
            $student->Student_Num,
            $student->Lname,
            $student->Fname,
            $student->College_Name,
            $student->Course_Name,
            $student->Ojt_Hours,
            $student->Semester,
            $student->Year
        ];
    }
}