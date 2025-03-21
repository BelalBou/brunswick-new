<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
{
    protected $table = 'menus';

    protected $fillable = [
        'title',
        'title_en',
        'description',
        'description_en',
        'pricing',
        'picture',
        'deleted',
        'supplier_id',
        'category_id',
        'menu_size_id',
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
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function menuSize(): BelongsTo
    {
        return $this->belongsTo(MenuSize::class);
    }

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_menus')
            ->withPivot(['remark', 'pricing', 'quantity', 'date', 'article_not_retrieved', 'deleted'])
            ->withTimestamps();
    }

    public function allergies(): BelongsToMany
    {
        return $this->belongsToMany(Allergy::class, 'allergy_menus')
            ->withPivot('deleted')
            ->withTimestamps();
    }

    public function extras(): BelongsToMany
    {
        return $this->belongsToMany(Extra::class, 'extra_menus')
            ->withPivot('deleted')
            ->withTimestamps();
    }
} 