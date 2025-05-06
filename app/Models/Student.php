<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'tbl_student';

    protected $fillable = ['Course_ID', 'Fname', 'Lname', 'Student_Num', 'Year', 'Remarks'];

    public function course()
    {
        return $this->belongsTo(Course::class, 'Course_ID', 'id');
    }

    public function ojtHours()
    {
        return $this->hasOne(OjtHours::class, 'course_name', 'Course_Name');
    }

    // ✅ Optional: Reverse relation (if you want to access user from student)
    public function user()
    {
        return $this->hasOne(User::class, 'student_id');
    }
}
