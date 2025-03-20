<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderMenu extends Model
{
    protected $table = 'order_menus';

    protected $fillable = [
        'order_id',
        'menu_id',
        'remark',
        'pricing',
        'quantity',
        'date',
        'article_not_retrieved',
        'deleted',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'pricing' => 'decimal:2',
        'quantity' => 'integer',
        'date' => 'datetime',
        'article_not_retrieved' => 'boolean',
        'deleted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
} 