<?php

namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;

class StudentsImport implements ToModel
{
    public function model(array $row)
    {
        return new Student([
            'student_number' => $row[0],
            'first_name' => $row[1],
            'last_name' => $row[2],
            'college' => request('college'),
            'course' => request('course'),
            'semester' => request('semester'),
            'school_year' => request('schoolYear'),
            'ojt_hours' => $this->getOjtHours(request('college'), request('course')),
        ]);
    }

    private function getOjtHours($college, $course)
    {
        return \DB::table('tbl_ojt_hrs')
            ->where('college', $college)
            ->where('course', $course)
            ->value('Hrs') ?? 0;
    }
}
