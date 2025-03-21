<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $table = 'suppliers';

    protected $fillable = [
        'name',
        'email_address',
        'email_address2',
        'email_address3',
        'for_vendor_only',
        'away_start',
        'away_end',
        'deleted',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'for_vendor_only' => 'boolean',
        'deleted' => 'boolean',
        'away_start' => 'date',
        'away_end' => 'date',
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

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }
} 