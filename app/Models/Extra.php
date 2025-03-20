<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Extra extends Model
{
    protected $fillable = [
        'title',
        'title_en',
        'description',
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
    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_extras')
            ->withPivot('quantity')
            ->withTimestamps();
    }
} 