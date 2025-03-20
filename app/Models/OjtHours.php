<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OjtHours extends Model
{
    use HasFactory;

    protected $table = 'tbl_ojt_hrs';

    protected $fillable = ['Student_Num', 'Course_ID', 'Hrs', 'Sem', 'Year'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'Student_Num', 'Student_Num');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'Course_ID', 'id');
    }
}
