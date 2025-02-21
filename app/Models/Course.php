<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'tbl_course';

    protected $fillable = ['College', 'Course'];

    // public function ojtHours() {
    //     return $this->hasOne(OjtHours::class, 'Course_ID', 'id');
    // }

    public function ojtHours()
    {
        return $this->hasMany(OjtHours::class, 'Course_ID', 'id');
    }
}
