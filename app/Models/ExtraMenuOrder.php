<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExtraMenuOrder extends Model
{
    protected $table = 'extra_menu_orders';

    protected $fillable = [
        'order_id',
        'extra_menu_id',
        'pricing',
        'deleted',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'pricing' => 'decimal:2',
        'deleted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function extraMenu(): BelongsTo
    {
        return $this->belongsTo(ExtraMenu::class);
    }
} 