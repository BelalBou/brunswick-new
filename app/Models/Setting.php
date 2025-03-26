<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'id',
        'created_at',
        'email_supplier_cc',
        'updated_at',
        'end_period',
        'settings',
        'email_order_cc',
        'start_period',
        'email_vendor_cc',
        'time_limit'
    ];

    protected $casts = [
        'start_period' => 'integer',
        'end_period' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
} 