<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'tbl_course';

    protected $fillable = ['College', 'Course'];

    public function ojtHours()
    {
        return $this->hasMany(OjtHours::class, 'Course_ID', 'id');
    }
}
