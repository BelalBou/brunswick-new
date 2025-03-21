<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'date',
        'deleted',
        'email_send',
        'user_id',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'date' => 'date',
        'deleted' => 'boolean',
        'email_send' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'order_menus')
            ->withPivot(['remark', 'pricing', 'quantity', 'date', 'article_not_retrieved', 'deleted'])
            ->withTimestamps();
    }
} 