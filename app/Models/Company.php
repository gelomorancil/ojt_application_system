<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $table = 'tbl_company'; 

    protected $fillable = ['Comp_name', 'Address', 'Course'];

    public function compCourse()
    {
        return $this->hasOne(CompCourse::class, 'Comp_ID', 'id');
    }

    public function departments()
    {
    return $this->hasMany(Department::class, 'Comp_ID');
    }

}
