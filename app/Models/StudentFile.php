<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentFile extends Model
{
    protected $table = 'tbl_student_files';

    protected $fillable = [
        'Student_Num',
        'file_name',
        'category',
    ];
    // Relationship to Student (assuming Student model exists)
    public function student()
    {
        return $this->belongsTo(Student::class, 'Student_Num', 'Student_Num');
    }
}
