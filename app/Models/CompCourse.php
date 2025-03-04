<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompCourse extends Model
{
    use HasFactory;

    protected $table = 'tbl_comp_course'; 

    protected $fillable = ['Comp_ID', 
    'name', 
    'position', 
    'Course', 
    'email', 
    'contact_number', 
    'Capacity', 
    'mode'];


    public function company()
    {
        return $this->belongsTo(Company::class, 'Comp_ID');
    }
}
