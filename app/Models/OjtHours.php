<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OjtHours extends Model
{
    use HasFactory;

    protected $table = 'tbl_ojt_hrs';

    protected $fillable = ['Course_ID', 'Hrs', 'Sem', 'Year'];

    public function course()
    {
        return $this->hasMany(OjtHour::class, 'Course_ID', 'id');
    }
}
