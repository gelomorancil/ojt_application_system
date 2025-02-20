<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Moa extends Model
{
    use HasFactory;

    protected $table = 'tbl_moa';

    protected $fillable = [
        'File_name',
        'File_type',
        'File',
        'Start',
        'End',
    ];

}
