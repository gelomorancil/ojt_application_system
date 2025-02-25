<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $table = 'tbl_company'; 

    protected $fillable = ['Comp_name', 'Address', 'Tel_num'];

    public function compCourse()
    {
        return $this->hasOne(CompCourse::class, 'Comp_ID', 'id');
    }
}