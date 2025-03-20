<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExtraMenu extends Model
{
    protected $table = 'extra_menus';

    protected $fillable = [
        'menu_id',
        'extra_id',
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
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function extra(): BelongsTo
    {
        return $this->belongsTo(Extra::class);
    }
} 