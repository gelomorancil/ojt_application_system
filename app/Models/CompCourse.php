<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompCourse extends Model
{
    use HasFactory;

    protected $table = 'tbl_comp_course'; 

    protected $fillable = ['Comp_ID', 'email', 'Position', 'Course', 'Capacity', 'Mode'];


    public function company()
    {
        return $this->belongsTo(Company::class, 'Comp_ID');
    }
}
