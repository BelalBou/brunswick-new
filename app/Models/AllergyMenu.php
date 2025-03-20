<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AllergyMenu extends Model
{
    protected $table = 'allergy_menus';

    protected $fillable = [
        'menu_id',
        'allergy_id',
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

    public function allergy(): BelongsTo
    {
        return $this->belongsTo(Allergy::class);
    }
} 