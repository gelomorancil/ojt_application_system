<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactPerson extends Model
{
    use HasFactory;

    protected $table = 'contact_persons'; 

    protected $fillable = [
        'Comp_ID',
        'name',
        'department',
        'email',
        'phone',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'Comp_ID');
    }
}
