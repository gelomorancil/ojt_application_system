<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentCompany extends Model
{
    use HasFactory;

    protected $table = 'tbl_student_comp';

    protected $fillable = [
        'Comp_ID',
        'Student_ID',
        'Sem',
        'AY',
        'Status',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'Comp_ID');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'Student_ID');
    }

    public function course()
    {
        return$this->belongsTo(Course::class, 'Course_ID');
    }
}
