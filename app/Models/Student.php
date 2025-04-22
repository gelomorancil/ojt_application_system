<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Course;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    protected $table = 'tbl_student';

    protected $fillable = [
        'Course_ID',
        'Fname',
        'Lname',
        'Student_Num',
        'Year',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'Course_ID', 'id')->first()->toArray();
    }

    public function ojtHours()
    {
        return $this->hasOne(OjtHours::class, 'course_name', 'Course_Name');
    }
}
