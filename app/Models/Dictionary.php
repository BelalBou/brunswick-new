<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dictionary extends Model
{
    protected $table = 'dictionaries';

    protected $fillable = [
        'tag',
        'translation_fr',
        'translation_en',
        'deleted',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'deleted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
} 