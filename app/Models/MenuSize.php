<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuSize extends Model
{
    protected $table = 'menu_sizes';

    protected $fillable = [
        'title',
        'title_en',
        'deleted',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'deleted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    public function extras(): HasMany
    {
        return $this->hasMany(Extra::class);
    }
} 