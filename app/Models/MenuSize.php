<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuSize extends Model
{
    protected $fillable = [
        'menu_id',
        'name',
        'price',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
} 