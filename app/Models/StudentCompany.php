<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentCompany extends Model
{
    use HasFactory;

    protected $table = 'tbl_student_comp'; // Ensure correct table name

    protected $fillable = ['Student_ID', 'Comp_ID', 'Sem', 'AY', 'Status'];

    public $timestamps = false; // Disable timestamps if not present in your DB
}
