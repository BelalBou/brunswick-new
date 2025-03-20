<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyMail extends Model
{
    protected $table = 'daily_mails';

    protected $fillable = [
        'date',
        'sent',
        'error',
        'deleted',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'date' => 'datetime',
        'sent' => 'boolean',
        'deleted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
} 