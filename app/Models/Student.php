<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Course;

class Student extends Model
{
    use HasFactory;

    protected $table = 'tbl_student';

    protected $fillable = ['Course_ID', 'Fname', 'Lname', 'Student_Num'];

    public function course() {
        return $this->belongsTo(Course::class, 'Course_ID', 'id');
    }
}
