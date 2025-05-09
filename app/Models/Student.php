<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'tbl_student';
    
    protected $fillable = [
        'Course_ID',
        'Fname',
        'Lname',
        'Student_Num',
        'Year',
        'Remarks',
        'Read'
    ];

    // Disable Laravel's timestamp fields if they don't exist in your table
    // public $timestamps = false;

    /**
     * The "booted" method of the model.
     * Set up event listeners for the model.
     */
    protected static function booted()
    {
        // When a student is being deleted, also delete the associated user
        static::deleting(function ($student) {
            if ($student->user) {
                $student->user->delete();
            }
        });
    }

    /**
     * Get the course that the student belongs to
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'Course_ID', 'id');
    }

    /**
     * Get the OJT hours for the student's course
     */
    public function ojtHours()
    {
        return $this->hasOneThrough(
            OjtHours::class, 
            Course::class,
            'id', // Foreign key on courses table
            'Course_ID', // Foreign key on ojt_hours table
            'Course_ID', // Local key on students table
            'id' // Local key on courses table
        );
    }

    /**
     * Get the user associated with the student
     */
    public function user()
    {
        return $this->hasOne(User::class, 'student_id');
    }

    /**
     * Get the company relationships for this student
     */
    public function companies()
    {
        return $this->hasMany(StudentCompany::class, 'Student_ID');
    }

    /**
     * Get the student files
     */
    public function files()
    {
        return $this->hasMany(StudentFile::class, 'Student_Num', 'id');
    }

    /**
     * Get student's full name
     */
    public function getFullNameAttribute()
    {
        return $this->Fname . ' ' . $this->Lname;
    }
}