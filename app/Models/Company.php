<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $table = 'tbl_company';

    protected $fillable = ['Comp_name', 'Address'];

    protected static function boot()
    {
        parent::boot();

        // ✅ Automatically insert a record in tbl_moa_process when a new company is added
        static::created(function ($company) {
            MoaProcess::create(['Comp_ID' => $company->id]);
        });

        // ✅ Automatically delete the related record in tbl_moa_process when a company is deleted
        static::deleting(function ($company) {
            MoaProcess::where('Comp_ID', $company->id)->delete();
        });
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'tbl_comp_course', 'Comp_ID', 'Course'); 
    }

    public function CompCourse(): HasMany
{
    return $this->hasMany(CompCourse::class, 'Comp_ID', 'id');
}
}
