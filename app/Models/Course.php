<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Course extends Authenticatable
{
    use HasFactory;

    protected $table = 'tbl_course';

    protected $fillable = ['College', 'Course'];

    public function ojtHours() {
        return $this->hasOne(OjtHours::class, 'Course_ID', 'id');
    }
}
