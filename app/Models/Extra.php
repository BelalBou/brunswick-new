<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Extra extends Model
{
    protected $table = 'extras';


    protected $fillable = [
        'title',
        'title_en',
        'pricing',
        'deleted',
        'supplier_id',
        'menu_size_id',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'pricing' => 'decimal:2',
        'deleted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relations
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function menuSize(): BelongsTo
    {
        return $this->belongsTo(MenuSize::class);
    }

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'extra_menus')
            ->withPivot('deleted')
            ->withTimestamps();
    }

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_extras')
            ->withPivot('quantity')
            ->withTimestamps();
    }
} 