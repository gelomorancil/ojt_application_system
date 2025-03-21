<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompCourse extends Model
{
    use HasFactory;

    protected $table = 'tbl_comp_course';

    protected $fillable = [
        'Comp_ID',
        'name',
        'position',
        'Course_id',
        'email',
        'contact_number',
        'Capacity',
        'mode'
    ];

    protected $casts = [
        'Course_id' => 'array',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'Comp_ID');
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'tbl_comp_course', 'Comp_ID', 'Course_id');
    }
}
