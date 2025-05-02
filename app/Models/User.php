<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'student_id', // ✅ Correct this
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            // 'password' => 'hashed', // ✅ (optional to comment/remove if not necessary)
            // 'role' => UserRole::class, // ✅ comment/remove unless you actually use Enums
        ];
    }

    // ✅ Relationship: User belongs to Student
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
