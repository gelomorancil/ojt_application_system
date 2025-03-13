<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MoaProcess extends Model
{
    use HasFactory;

    protected $table = 'tbl_moa_process'; // Custom table name

    protected $fillable = [
        'Comp_ID',
        'For_Review',
        'For_Coordinator',
        'For_VCAA',
        'For_Company',
        'For_Notarization',
        'Expiry'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'Comp_ID', 'id');
    }

}
