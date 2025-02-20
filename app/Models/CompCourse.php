<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompCourse extends Model
{
    use HasFactory;
    
    protected $table = 'tbl_comp_course';

    protected $fillable = ['Comp_ID', 'Course_ID', 'Capacity', 'Mode'];

    public function Company()
    {
        return $this->belongsTo(Company::class, 'Comp_ID');
    }

    public function Course()
    {
        return $this->belongsTo(Course::class, 'Course_ID');
    }
}
