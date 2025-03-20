<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyMail extends Model
{
    protected $table = 'daily_mails';

    protected $fillable = [
        'date',
        'sent',
        'error',
        'deleted'
    ];

    protected $casts = [
        'date' => 'datetime',
        'sent' => 'boolean',
        'deleted' => 'boolean'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 