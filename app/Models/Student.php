<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'tbl_student';

    protected $fillable = ['Course_ID', 'Fname', 'Lname', 'Student_Num'];
}
