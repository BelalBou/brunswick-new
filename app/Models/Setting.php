<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'key',
        'value',
        'value_en',
        'time_limit',
        'start_period',
        'end_period',
        'email_order_cc',
        'email_supplier_cc',
        'email_vendor_cc',
        'language',
        'description',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'time_limit' => 'string',
        'start_period' => 'datetime',
        'end_period' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
} 